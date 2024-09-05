export const currencies = [
    {
        value: "INR",
        label: "₹ Rupee",
        local: "en-IN"
    },
    {
        value: "USD",
        label: "$ Dollar",
        local: "en-US"
    },
    {
        value: "EUR",
        label: "€ Euro",
        local: "de-DE"
    },
    {
        value: "GBP",
        label: "£ Pound",
        local: "en-GB"
    },
    {
        value: "JPY",
        label: "¥ Yen",
        local: "ja-JP"
    }
];

export type Currency = (typeof currencies)[0];