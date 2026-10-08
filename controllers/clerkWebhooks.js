import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
    try {
        const evt = await verifyWebhook(req);

        const { data, type } = evt;

        const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address,
            username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            image: data.image_url,
        };

        switch (type) {
            case "user.created": {
                await User.create(userData);
                break;
            }

            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                break;
            }

            default:
                break;
        }

        res.status(200).json({
            success: true,
            message: "Webhook Received",
        });

    } catch (error) {
        console.error("Webhook error:", error);

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export default clerkWebhooks;