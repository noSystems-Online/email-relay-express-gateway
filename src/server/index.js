
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { validationResult, check } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

// Validation middleware
const validateEmailRequest = [
  check('smtp.host').notEmpty().withMessage('SMTP host is required'),
  check('smtp.port').isInt({ min: 1, max: 65535 }).withMessage('Valid SMTP port is required'),
  check('smtp.username').notEmpty().withMessage('SMTP username is required'),
  check('smtp.password').notEmpty().withMessage('SMTP password is required'),
  check('smtp.crypto').isIn(['ssl', 'tls', 'none']).withMessage('Crypto must be ssl, tls, or none'),
  // Make from email and name optional but if provided, validate the email format
  check('email.fromEmail').optional({ checkFalsy: true }).isEmail().withMessage('If provided, sender email must be valid'),
  check('email.fromName').optional(),
  check('email.to').isArray({ min: 1 }).withMessage('At least one recipient is required'),
  check('email.to.*').isEmail().withMessage('All recipients must be valid emails'),
  check('email.subject').notEmpty().withMessage('Subject is required'),
  check('email.html').optional(),
  check('email.text').optional(),
  check('email.cc').optional().isArray(),
  check('email.cc.*').optional().isEmail().withMessage('All CC recipients must be valid emails'),
  check('email.bcc').optional().isArray(),
  check('email.bcc.*').optional().isEmail().withMessage('All BCC recipients must be valid emails'),
  check('email.replyTo').optional().isArray(),
  check('email.replyTo.*').optional().isEmail().withMessage('All reply-to addresses must be valid emails')
];

// Routes
app.post('/api/send-email', validateEmailRequest, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { smtp, email } = req.body;

  try {
    // Configure transport based on crypto setting    
    const transportConfig = {
      host: smtp.host,
      port: smtp.port,
      auth: {
        user: smtp.username,
        pass: smtp.password
      }
    };
    
     
    // Set secure option based on crypto
    /*
    if (smtp.crypto === 'ssl') {
      transportConfig.secure = true;
    } else if (smtp.crypto === 'tls') {
      transportConfig.secure = false;
      transportConfig.tls = {
        ciphers: 'SSLv3'
      };
    } else {
      transportConfig.secure = false;
    }
    */
    if (smtp.crypto === 'ssl') {
      transportConfig.secure = true; // Port 465
    } else if (smtp.crypto === 'tls') {
      transportConfig.secure = false; // Port 587
      transportConfig.requireTLS = true; // This line is important for Gmail
    } else {
      transportConfig.secure = false;
    }


    const transporter = nodemailer.createTransport(transportConfig);

    // Prepare email
    const mailOptions = {
      subject: email.subject,
      text: email.text,
      html: email.html,
      to: email.to.join(', '),
    };
    
    // Add from field with fallback to SMTP username if not provided
    if (email.fromEmail) {
      const fromField = email.fromName 
        ? `"${email.fromName}" <${email.fromEmail}>`
        : email.fromEmail;
      mailOptions.from = fromField;
    } else {
      // Default to SMTP username if no from email is provided
      mailOptions.from = smtp.username;
    }

    // Add optional fields if present
    if (email.cc && email.cc.length > 0) {
      mailOptions.cc = email.cc.join(', ');
    }
    
    if (email.bcc && email.bcc.length > 0) {
      mailOptions.bcc = email.bcc.join(', ');
    }
    
    if (email.replyTo && email.replyTo.length > 0) {
      mailOptions.replyTo = email.replyTo.join(', ');
    }
    
    if (email.attachments && email.attachments.length > 0) {
      mailOptions.attachments = email.attachments;
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to send email'
    });
  }
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'operational' });
});

// Start server if running directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for testing or importing
module.exports = app;
