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

export async function sendBanEmail({ to, name, reason }) {
    const mailOptions = {
        from: `"ReGoods Support" <${process.env.EMAIL_FROM}>`,
        to: to,
        subject: "Important Information Regarding Your ReGoods Account",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fee2e2; border-radius: 20px; background-color: #fffafb;">
                <h1 style="color: #ef4444; margin-bottom: 20px;">Account Suspended</h1>
                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    Hello ${name},
                </p>
                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    We are writing to inform you that your ReGoods account has been **permanently banned** due to repeated violations of our platform policies.
                </p>
                
                <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #f8d7da;">
                    <h2 style="font-size: 12px; color: #991b1b; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0;">Reason for Suspension</h2>
                    <p style="margin: 8px 0; font-size: 15px; color: #b91c1c; font-weight: 500;">
                        ${reason}
                    </p>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
                    As a result of this action, you will no longer be able to log in, list items, or interact with other users on the platform. Any active listings have been removed.
                </p>

                <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
                    If you believe this decision was made in error, you may contact our appeals team.
                </p>

                <hr style="margin-top: 40px; border: 0; border-top: 1px solid #fee2e2;" />
                <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 20px;">
                    This is an automated security notification. &copy; ${new Date().getFullYear()} ReGoods Platform.
                </p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
}

export async function sendUnbanEmail({ to, name }) {
    const mailOptions = {
        from: `"ReGoods Support" <${process.env.EMAIL_FROM}>`,
        to: to,
        subject: "Your ReGoods Account Has Been Reactivated",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1fae5; border-radius: 20px; background-color: #f0fdf4;">
                <h1 style="color: #059669; margin-bottom: 20px;">Welcome Back!</h1>
                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    Hello ${name},
                </p>
                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    We are pleased to inform you that after a thorough review, your ReGoods account has been **reactivated**.
                </p>
                
                <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #a7f3d0; text-align: center;">
                    <p style="margin: 0; font-size: 16px; color: #065f46; font-weight: 600;">
                        You can now log in and resume using all marketplace features.
                    </p>
                    <div style="margin-top: 24px;">
                        <a href="${process.env.NEXTAUTH_URL}/auth/login" style="background-color: #10b981; color: white; padding: 12px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            Login to Your Account
                        </a>
                    </div>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
                    Please ensure you continue to follow our community guidelines to maintain a safe and fair marketplace for everyone.
                </p>

                <hr style="margin-top: 40px; border: 0; border-top: 1px solid #d1fae5;" />
                <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 20px;">
                    &copy; ${new Date().getFullYear()} ReGoods Platform. All rights reserved.
                </p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
}
