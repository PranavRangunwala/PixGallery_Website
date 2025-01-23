import React from 'react';
import html2pdf from 'html2pdf.js'; // Import html2pdf
import "./style.css";

const InvoiceGenerator = ({
  invoiceId,
  uname,
  email,
  plan,
  price,
  formattedDate,
  formattedTime
}) => {

  const generateInvoice = () => {
    const invoiceElement = document.getElementById('invoice');

    // Temporarily make the invoice element visible
    invoiceElement.style.display = 'block';

    // Generate the PDF
    html2pdf()
      .from(invoiceElement)
      .save(`invoice_${invoiceId}.pdf`)
      .then(() => {
        // Hide the invoice element again after the PDF is generated
        invoiceElement.style.display = 'none';
      });
  };

  return (
    <div>
      <div className="mb-4">
        <button onClick={generateInvoice}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          fontSize: '14px', 
          cursor: 'pointer' 
        }}>Download PDF</button>
      </div>

      {/* Hidden Invoice Template */}
      <div id="invoice" className="invoice-box">
        <table cellPadding="0" cellSpacing="0">
          <tr className="top">
            <td colSpan="2">
              <table>
                <tr>
                  <td className="title">
                    <h2>PixGallary</h2>
                    <p>Address: Surat, Gujarat, India</p>
                    <p>Contact: +91 1234567890</p>
                  </td>
                  <td>
                    Invoice #: {invoiceId}<br />
                    Created: {new Date().toLocaleDateString()}<br />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr className="information">
            <td colSpan="2">
              <table>
                <tr>
                  <td>
                    Billed To:<br />
                    {uname || 'Customer Name'}<br />
                    {email || 'Customer Email Address'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr className="heading">
            <td>Plan</td>
            <td>Price Paid</td>
          </tr>

          <tr className="item">
            <td>
              <strong>{plan}</strong><br />
              Plan Created At: {formattedDate} {formattedTime}
            </td>
            <td>{price} ₹</td>
          </tr>

          <tr className="total">
            <td></td>
            <td>Total: {price} ₹</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
