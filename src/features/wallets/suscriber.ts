/**
 *
 * @description subScribes for wallet Feature
 */
import { Logger } from 'winston';
import compEmitter, { registerEvents } from '@libs/suscribers';

declare let _logger: Logger;

const walletEvents = (eventEmitter: typeof compEmitter) => {
    eventEmitter.on('New Wallet', (wallet: object) => {
        _logger.info(`✅✅✅ ➡ New Wallet has been created!\nWallet = ${wallet}`);
    });

    eventEmitter.on('Updated Wallet', (wallet: object) => {
        _logger.info(`✅✅✅ ➡ Wallet has been updated!\nWallet = ${wallet}`);
    });

    eventEmitter.on('Deleted Wallet', (wallet: object) => {
        _logger.info(`✅✅✅ ➡ Wallet has been updated!\nWallet = ${wallet}`);
    });

    return eventEmitter;
};

registerEvents(walletEvents);

export default walletEvents;
