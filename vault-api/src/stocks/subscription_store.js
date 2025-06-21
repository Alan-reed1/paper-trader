const subscriptions = new Map()

export const subscriptionStore = {
    subscribe(userId, symbol) {
        if (!subscriptions.has(symbol)) {
            subscriptions.set(symbol, new Set());

            this._startPolling(symbol);
        }
        subscriptions.get(symbol).add(userId);
    },

    unsubscribe(userId, symbol) {
        if (!subscriptions.has(symbol)) return;
        const subs = subscriptions.get(symbol);
        subs.delete(userId);

        if (subs.size === 0) {
            subscriptions.delete(symbol);
            this._stopPolling(symbol);
        }
    }, 

    getSubscribers(symbol) {
        return subscriptions.get(symbol) || new Set();
    },

    hasSubscribers(symbol) {
        return subscriptions.has(symbol) && subscriptions.get(symbol).size > 0
    },

    _startPolling(symbol) {
        console.log(`polling for ${symbol}`);
        // polling logic
    },

    _stopPolling(symbol) {
        console.log(`stopping polling for ${symbol}`);
        // emit trigger event to stop polling
    },

    listSubscriptions() {
        return Array.from(subscriptions.entries()).map(([symbol, set]) => ({
            symbol,
            subsriberCount: set.size,
        }));
    },
}