const itemModel = require("../model/Item.model");
const UserModel = require("../model/User.model");
const requestItemModel = require("../model/RequestItem.model");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dfl20jy4v",
  api_key: "365442613925673",
  api_secret: "tK6YqIM0MXvJkZCB-kYc5x-eZYY",
});

module.exports.createNewItem = async (req, res) => {
  try {
    const { items } = req.body;
    const { email } = req.user;

    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res.status(400).send("User not found");
    }

    const itemObjects = [];

    for (const item of items) {
      const { itemNumber, name, quality, description, quantity, ssid, image } =
        item;

      const result = await cloudinary.uploader.upload(image, {
        folder: "items",
      });

      const itemObject = {
        itemNumber,
        name,
        quality,
        quantity,
        ssid,
        image: {
          public_id: result.public_id,
          url: result.secure_url,
        },
        description,
        adminIds: user._id,
      };

      itemObjects.push(itemObject);
    }

    const insertedItems = await itemModel.insertMany(itemObjects);

    if (insertedItems.length > 0) {
      const insertedItemIds = insertedItems.map((item) => item._id);

      return res.status(201).send({ insertedItemIds });
    } else {
      return res.status(400).send("Error while creating items");
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};

module.exports.getItemsById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await itemModel
      .findOne({ _id: id })
      .lean()
      .populate("userIds");
    if (item) {
      return res.send(item);
    }
  } catch (error) {
    console.log({ error });
  }
};

module.exports.getAllItems = async (req, res) => {
  try {
    const items = await itemModel.find().lean();

    if (!items) {
      return res.status(401).send("No item found");
    }
    return res.status(200).send(items);
  } catch (error) {
    console.log({ error });
  }
};

module.exports.getRequestedItems = async (req, res) => {
  try {
    const Requesteditems = await requestItemModel
      .find()
      .lean()
      .populate("itemId")
      .populate("userId");
    const items = await itemModel.find().lean();

    if (!Requesteditems) {
      return res.status(404).send("No item found");
    }
    return res.status(200).send({ items: items, reqItem: Requesteditems });
  } catch (error) {
    console.log({ error });
  }
};

module.exports.requestItems = async (req, res) => {
  try {
    const {
      itemId,
      Department,
      Requester,
      RequestedItem,
      DeliveryDate,
      Purpose,

      RequiredUnit,
    } = req.body;
    const { email } = req.user;

    const item = await itemModel.findOne({ _id: itemId }).lean();
    if (!item) {
      return res.status(404).send({ msg: "Item not found" });
    }

    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res.status(404).send("User not found");
    }

    const requestItemObject = {
      itemId,
      userId: user._id,
      RequiredUnit,
      DeliveryDate,
      Purpose,
    };
    await requestItemModel.create(requestItemObject);
    return res.status(201).send("Item requested successfully");
  } catch (error) {
    console.log({ error });
  }
};

module.exports.approveItemRequest = async (req, res) => {
  try {
    const { ssid, id } = req.body;

    const itemRequest = requestItemModel.findOne({ _id: id }).lean();

    if (itemRequest.Status) {
      return res.status(401).send({ msg: "Request is already approved" });
    }
    await requestItemModel.findOneAndUpdate(
      { _id: id },
      {
        Status: true,
      }
    );
    ssid.forEach(async (element) => {
      const item = await itemModel.findOne({ ssid: element }).lean();
      if (!item) {
        return res.status(404).send({ msg: "Cant find item" });
      }
      if (item.Status) {
        return res.status(401).send({ msg: "Already occupied" });
      }
      await itemModel.findOneAndUpdate(
        { _id: item._id },
        {
          Status: true,
        }
      );
    });
    res.status(201).send("Successfully approved");
  } catch (error) {
    console.log({ error });
  }
};
