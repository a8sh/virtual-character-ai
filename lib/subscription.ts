import {auth} from "@clerk/nextjs";
import prismadb from "./prismadb";

const DAY_IN_MS = 86_400_000;

export const checkSubscription =async () => {
    const {userId} = auth();

    if(!userId){
        return false;
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
        where:{
            userId: userId,
        },
        select:{
            stripeCurrentPeriodEnd:true,
            stripePriceId:true,
            stripeCustomerId:true,
            stripeSubscriptionId:true,
        }
    });

    if(!userSubscription) {
        return false;
    }
    const isValid = 
    userSubscription.stripeCurrentPeriodEnd && 
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now() 

    return !!isValid;
}