import * as alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';
import { Vehicle_Behavior, VEHICLE_STATE } from '@AthenaShared/enums/vehicle';
import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
import { isFlagEnabled } from '@AthenaShared/utility/flags';
import { FUEL_CONFIG } from './config';

function setFuel(player: alt.Player, amount: string) {
    let actualAmount = parseInt(amount);

    if (typeof actualAmount !== 'number') {
        Athena.player.emit.message(player, `Invalid amount to fuel to.`);
        return;
    }

    if (actualAmount > FUEL_CONFIG.MAXIMUM_FUEL) {
        actualAmount = FUEL_CONFIG.MAXIMUM_FUEL;
    }

    if (!player.vehicle) {
        Athena.player.emit.message(player, `Must be in a vehicle.`);
        return;
    }

    if (!isFlagEnabled(player.vehicle.data.behavior, Vehicle_Behavior.CONSUMES_FUEL)) {
        return;
    }

    player.vehicle.data.fuel = actualAmount;
    player.vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, player.vehicle.data.fuel);
    player.vehicle.setSyncedMeta(VEHICLE_STATE.POSITION, player.vehicle.pos);
    Athena.vehicle.funcs.save(player.vehicle, { fuel: player.vehicle.data.fuel });
}

export class FuelCommands {
    static init() {
        Athena.controllers.chat.addCommand('setfuel', '/setfuel [amount]', PERMISSIONS.ADMIN, setFuel);
    }
}
