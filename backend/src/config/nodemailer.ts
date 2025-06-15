import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendDueReminder = async (
    to: string,
    bookTitle: string,
    dueDate: Date
) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Book Due Reminder",
        html: `<p>Your borrowed book "${bookTitle}" is due on ${dueDate.toDateString()}. Please return it on time to avoid fines.</p>`,
    });
};

export const setOverdueNotification = async (
    to: string,
    bookTitle: string,
    fine: number
) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Overdue Book Notification",
        html: `<p>Your borrowed book "${bookTitle}" is overdue. You have incurred a fine of $${fine}. Please return the book as soon as possible.</p>`,
    });
};
