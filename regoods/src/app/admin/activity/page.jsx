import { getSoldItems, getRecentOffers } from "@/app/actions/admin";
import ActivityManagement from "@/components/admin/ActivityManagement";

export default async function ActivityPage() {
    const soldItems = await getSoldItems();
    const offers = await getRecentOffers();

    return (
        <ActivityManagement 
            initialSoldItems={soldItems} 
            initialOffers={offers} 
        />
    );
}
