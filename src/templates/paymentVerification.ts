const paymentVerification = (name: string, amount: number) => {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            text-align: center;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333333;
          }
          p {
            color: #666666;
          }
          .verification-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #ffffff;
            font-size : "20px";
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Payment Verification</h1>
          <p>Dear ${name},</p>
          <p>Thank you for your payment of:</p>
          <h6 class="verification-link">
            $${amount}
          </h6>
          <p>If you already paid this, you can ignore this email.</p>
          <p>Best regards,<br>Avrio Global</p>
        </div>
      </body>
      </html>`;
};

export default paymentVerification;
