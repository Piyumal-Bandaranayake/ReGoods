import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export async function sendWelcomeEmail({ to, name, email, password, role }) {
    const isSystemAdmin = role === "admin";
    
    const mailOptions = {
        from: `"ReGoods" <${process.env.EMAIL_FROM}>`,
        to: to,
        subject: isSystemAdmin 
            ? "Welcome to the ReGoods Admin Team!" 
            : "Welcome to ReGoods!",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; rounded-lg: 20px;">
                <h1 style="color: #3b82f6; margin-bottom: 20px;">Hello, ${name}!</h1>
                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    An account has been created for you on **ReGoods** by an administrator. 
                    ${isSystemAdmin ? "You have been granted **Administrative Access** to the platform." : "You can now start buying and selling on our platform."}
                </p>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 24px 0;">
                    <h2 style="font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0;">Your Login Credentials</h2>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Password:</strong> <code style="background: #eee; padding: 2px 4px; border-radius: 4px;">${password}</code></p>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    We recommend changing your password after your first login for security.
                </p>

                <div style="margin-top: 32px;">
                    <a href="${process.env.NEXTAUTH_URL}/auth/login" style="background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                        Login to Your Account
                    </a>
                </div>

                <hr style="margin-top: 40px; border: 0; border-top: 1px solid #f0f0f0;" />
                <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
                    &copy; ${new Date().getFullYear()} ReGoods Platform. All rights reserved.
                </p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
}
