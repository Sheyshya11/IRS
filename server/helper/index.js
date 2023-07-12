module.exports = ({ name, price1, price2, receiptId }) => {
  const today = new Date();
  return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
          
             .invoice-box {
             max-width: 800px;
             margin: auto;
             padding: 30px;
             border: 1px solid #eee;
             box-shadow: 0 0 10px rgba(0, 0, 0, .15);
             font-size: 16px;
             line-height: 24px;
             font-family: 'Helvetica Neue', 'Helvetica',
             color: #555;
             }
             .header {
               margin-top: 20px;
               text-align: center;
               margin-bottom: 20px;
             }
             .margin-top {
             margin-top: 50px;
             }
             .justify-center {
             text-align: center;
             }
             .invoice-box table {
             width: 100%;
             line-height: inherit;
             text-align: left;
             }
             .invoice-box table td {
             padding: 5px;
             vertical-align: top;
             }
             .invoice-box table tr td:nth-child(2) {
             text-align: right;
             }
             .invoice-box table tr.top table td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.top table td.title {
             font-size: 45px;
             line-height: 45px;
             color: #333;
             }
             .invoice-box table tr.information table td {
             padding-bottom: 40px;
             }
             .invoice-box table tr.heading td {
             background: #eee;
             border-bottom: 1px solid #ddd;
             font-weight: bold;
             }
             .invoice-box table tr.details td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.item td {
             border-bottom: 1px solid #eee;
             }
             .invoice-box table tr.item.last td {
             border-bottom: none;
             }
             .invoice-box table tr.total td:nth-child(2) {
             border-top: 2px solid #eee;
             font-weight: bold;
             }
             @media only screen and (max-width: 600px) {
             .invoice-box table tr.top table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             .invoice-box table tr.information table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             }
          </style>
       </head>
       <body>
          <div class="invoice-box">
     <div class="header">
      
 <h2>Hardware Acquisition Form</h2>
          </div> 
             <table cellpadding="0" cellspacing="0">
                <tr class="top">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td class="title"><img  src="https://vairav.net/assets/backend/uploads/mascot_logo_original@2x%202.png"
                               style="width:100%; max-width:156px;"></td>
                            <td>
                               Date: ${`${today.getDate()}. ${
                                 today.getMonth() + 1
                               }. ${today.getFullYear()}.`}
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr class="information">    
                   <td colspan="2">
                      <table>
                         <tr>
                            <td>
                           Assets to be checked out:
                            </td>
                         
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr class="heading">
                   <td>Device Name</td>
                   <td>Serial Number</td>
                </tr>
                <tr class="item">
                   <td>First item:</td>
                   <td>${price1}$</td>
                </tr>
                <tr class="item">
                   <td>Second item:</td>
                   <td>${price2}$</td>
                </tr>
             </table>
             <br />
         <p>
         I, Subham Shrestha , acknowledge that I am responsible for the above listed assets and 
         that i have received them in good condition. I understand that I will be held accountable for any
          damages or loss incurred while these asasets are under my care.
         </p>
         <br/>
         <p>
         I agree to use these 
         </p>
          </div>

       </body>
    </html>
    `;
};
