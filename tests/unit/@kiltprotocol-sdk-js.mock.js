import { mockFunction } from "./mock"

module.exports = {
    Identity: {
        buildFromMnemonic(param) {
            mockFunction(param)
        }
    }
};