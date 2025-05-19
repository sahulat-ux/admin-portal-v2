export type TypeDashboardTransaction = {
    transaction_id: string;
    date_time: string;
    original_amount: string;
    status: "failed" | "successful" | "pending"; 
    type: "wallet"; 
    response_message: string;
    settlement: boolean;
    settled_amount: string;
    balance: string;
    merchant_transaction_id: string;
    merchant_id: number;
    customer_id: number | null;
    createdAt: string;
    updatedAt: string;
    providerId: number | null;
    providerDetails?: {
        id: number;
        name: string;
        msisdn: string;
    };
    callback_sent:boolean
};


export type TypeDashboardTransformedPayload = {
    transaction_id: string;
    merchant_transaction_id: string;
    account_no: string;
    date: string;
    amount: string;
    message: string;
    status: string;
    provider: string;
    settlement: boolean;
    type: string;
    callback_sent:boolean;
};

export const dashboardTransformPayload = (transactions: TypeDashboardTransaction[]): TypeDashboardTransformedPayload[] => {
    return transactions.map(transaction => {
        // Truncate the amount to 2 decimal places
        const truncatedAmount = Math.floor(parseFloat(transaction.original_amount) * 100) / 100;

        return {
            transaction_id: transaction.transaction_id,
            merchant_transaction_id: transaction.merchant_transaction_id,
            account_no: transaction.providerDetails?.msisdn || "",
            date: transaction.date_time,
            amount: truncatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            message: transaction.response_message,
            status: transaction.status,
            provider: transaction.providerDetails?.name || "",
            settlement: transaction.settlement,
            type: transaction.type,
            callback_sent: transaction.callback_sent
        };
    });
};
