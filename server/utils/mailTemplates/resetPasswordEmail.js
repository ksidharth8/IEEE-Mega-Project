const resetPasswordEmail = (name, url) => {
	return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Reset Password</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="#"><img class="logo"
                    src="https://imagizer.imageshack.com/img924/9537/yExcnO.png" alt="FasalSandhi Logo"></a>
            <div class="message">Reset Password</div>
            <div class="body">
                <p>Hey ${name},</p>
                <p>We received a request to reset the password for your account. If you did not make this request, please
                    contact us immediately to secure your account.</p>
                <p>Your Link for email verification is ${url}. Please click this url to reset your password</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
                at
                <a href="mailto:info@fasalsandhi.com">info@fasalsandhi.com</a>. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`;
};

module.exports = resetPasswordEmail;
