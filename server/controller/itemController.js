const itemModel = require("../model/Item.model");
const UserModel = require("../model/User.model");
const requestItemModel = require("../model/RequestItem.model");
const cloudinary = require("cloudinary");
const countModel = require("../model/count.model");

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

    const itemname = items[0]?.name;
    const quantityNum = Number(items[0]?.quantity);

    const oneoftheitem = await itemModel.findOne({ name: itemname }).lean();

    const itemObjects = [];

    // if the item doesnt exist
    if (!oneoftheitem) {
      for (const item of items) {
        const { name, quality, description, quantity, ssid, image } = item;

        const result = await cloudinary.uploader.upload(image, {
          folder: "items",
        });

        const itemObject = {
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

      const countObject = {
        itemName: itemname,
      };
      await countModel.create(countObject);
    } else {
      const oneoftheitemquantity = Number(oneoftheitem?.quantity);

      for (const item of items) {
        const {
          itemNumber,
          name,
          quality,
          description,
          quantity,
          ssid,
          image,
        } = item;

        const result = await cloudinary.uploader.upload(image, {
          folder: "items",
        });
        const itemStocNumber = Number(quantity) + Number(oneoftheitem.quantity);
        const itemObject = {
          itemNumber,
          name,
          quality,
          quantity: itemStocNumber,
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
      const increasedStockvalue = quantityNum + oneoftheitemquantity;

      const filter = { name: itemname };
      const update = {
        $set: { quantity: increasedStockvalue },
      };
      await itemModel.updateMany(filter, update);
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

module.exports.getItemsByName = async (req, res) => {
  try {
    const { name } = req.params;

    const item = await itemModel.find({ name }).lean();
    if (item) {
      return res.send(item);
    }
  } catch (error) {
    console.log({ error });
  }
};

module.exports.getRequestItemsByName = async (req, res) => {
  try {
    const { name } = req.params;

    const item = await requestItemModel
      .find({ itemName: name })
      .lean()
      .populate("userId");

    if (item) {
      return res.send(item);
    }
  } catch (error) {
    console.log({ error });
  }
};

module.exports.getAllItems = async (req, res) => {
  try {
    const items = await itemModel.find().lean().populate("userIds");

    if (!items) {
      return res.status(401).send("No item found");
    }

    return res.status(200).send(items);
  } catch (error) {
    console.log({ error });
  }
};

module.exports.getVisitCount = async (req, res) => {
  try {
    const { name } = req.params;
    const item = itemModel.findOne({ itemName: name }).lean();
    if (item) {
      const updatedVisitCounts = await countModel
        .findOneAndUpdate(
          { itemName: name },
          { $inc: { visitCount: 1 } },
          { new: true }
        )
        .lean();
      return res.status(200).send({ count: updatedVisitCounts.visitCount });
    }
  } catch (error) {
    console.log({ error });
  }
};

module.exports.getRequestedItems = async (req, res) => {
  try {
    const Requesteditems = await requestItemModel
      .find()
      .lean()
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
      itemName,
      Department,
      Requester,
      RequestedItem,
      DeliveryDate,
      Purpose,
      image,
      RequiredUnit,
    } = req.body;

    const { email } = req.user;
    const result = await cloudinary.uploader.upload(image, {
      folder: "items",
    });

    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res.status(404).send("User not found");
    }

    const requestItemObject = {
      itemName,
      userId: user._id,
      RequiredUnit,
      DeliveryDate,
      Purpose,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    };
    await requestItemModel.create(requestItemObject);
    return res.status(201).send("Item requested successfully");
  } catch (error) {
    console.log({ error });
  }
};

module.exports.approveItemRequest = async (req, res) => {
  try {
    const { listofSN, devices, userId } = req.body;

    //update itemRequest Status
    for (const item of devices) {
      const { id, serialNumbers } = item;

      const itemRequest = await requestItemModel.findOne({ _id: id }).lean();

      if (itemRequest.Status) {
        return res.status(401).send({ msg: "Request is already approved" });
      }
      const rqstQnty = Number(itemRequest?.GrantedUnit);
      const serialNumLength = Number(serialNumbers?.length);
      const requiredUnit = Number(itemRequest?.RequiredUnit);
      const response = await requestItemModel.findOneAndUpdate(
        { _id: id },
        {
          $set: { GrantedUnit: rqstQnty + serialNumLength },
        },
        { new: true } // This option returns the updated document
      );

      if (requiredUnit == Number(response.GrantedUnit)) {
        await requestItemModel.findOneAndUpdate(
          { _id: id },
          {
            Status: true,
          }
        );
      }
    }

    //update each item reservation status

    listofSN.forEach(async (element) => {
      const item = await itemModel.findOne({ ssid: element }).lean();
      if (!item) {
        return res.status(404).send({ msg: "Cant find item" });
      }
      if (item.Status) {
        return res.status(401).send({ msg: "Alrea: user._iddy occupied" });
      }
      await itemModel.findOneAndUpdate(
        { _id: item._id },
        {
          Status: true,
          userIds: userId,
          ReturnStatus: false,
        }
      );
    });
    res.status(201).send("Successfully approved");
  } catch (error) {
    console.log({ error });
  }
};

module.exports.getRequestedItemByQuery = async (req, res) => {
  try {
    const userId = req.query.id;

    const requestedItems = await requestItemModel.find({ userId }).lean();

    res.send(requestedItems);
  } catch (error) {
    console.log({ error });
  }
};

module.exports.ReturnItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await itemModel.findOne({ _id: itemId }).lean();

    if (item) {
      await itemModel.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            Status: false,
            ReturnStatus: true,
          },
          $unset: {
            userIds: 1, // Setting the value to 1 will delete the field
          },
        }
      );
    }
    res.send("Item retrieved");
  } catch (error) {
    console.log({ error });
  }
};

module.exports.editSSID = async (req, res) => {
  try {
    const { ssid, modifiedssid } = req.body;
    const item = await itemModel.findOne({ ssid }).lean();

    if (item.Status) {
      return res.status(400).send({ msg: "Item currenlty occupied" });
    }

    if (item) {
      await itemModel.findOneAndUpdate(
        {
          _id: item._id,
        },
        {
          $set: {
            ssid: modifiedssid,
          },
        }
      );
    }
    return res.send("Item modified");
  } catch (error) {
    console.log({ error });
  }
};

module.exports.deleteSSID = async (req, res) => {
  try {
    const { ssid } = req.params;

    const item = await itemModel.findOne({ ssid }).lean();
    // console.log(item);
    if (!item) {
      res.status(404).send({ msg: "Item not found" });
      return; // Exit early if item is not found
    }

    if (item.Status) {
      return res.status(400).send({ msg: "Item currently occupied" });
    }

    if (item) {
      const items = await itemModel.find({ name: item.name }).lean();
      if (items.length == 0) {
        await countModel.deleteMany({ itemName: item.name });
      }
      await itemModel.findByIdAndDelete({
        _id: item._id,
      });
      return res.status(200).send({ msg: "Item deleted successfully" });
    }
  } catch (error) {
    console.log({ error });
  }
};

module.exports.deleteInBulk = async (req, res) => {
  try {
    const { name } = req.params;
    const item = await itemModel.find({ name });
    if (!item) {
      return res.status(404).send({ msg: "No items found" });
    }
    let isOccupied = false;

    for (const i of item) {
      if (i.Status) {
        isOccupied = true;
        break;
      }
    }

    if (isOccupied) {
      return res.status(401).send({ msg: "Item is currently occupied" });
    }
    const result = await itemModel.deleteMany({ name });
    if (result.deletedCount) {
      await countModel.deleteMany({ itemName: name });
      return res.send("Item deleted sucessfuly");
    }
  } catch (error) {
    console.log({ error });
  }
};

module.exports.editInBulk = async (req, res) => {
  try {
    const { orginalName, name, description, supplier, image } = req.body;

    const itemsToUpdate = await itemModel.find({ name: orginalName }).lean();

    if (itemsToUpdate.length === 0) {
      return res
        .status(404)
        .send({ msg: "No items found with the given name." });
    }
    const imageCloud = await cloudinary.uploader.upload(image, {
      folder: "items",
    });
    const result = await itemModel.updateMany(
      { name: orginalName },
      {
        $set: {
          name,
          description,
          supplier,
          image: {
            public_id: imageCloud.public_id,
            url: imageCloud.secure_url,
          },
        },
      }
    );

    await countModel.updateMany(
      { itemName: orginalName },
      {
        $set: {
          itemName: name,
        },
      }
    );
    console.log(result);
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send({ msg: "No items found with the given name." });
    }

    return res.send(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ msg: "An error occurred while processing your request." });
  }
};
