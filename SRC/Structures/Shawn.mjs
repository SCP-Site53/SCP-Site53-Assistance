import { Seth } from './Seth.mjs';

export class Shawn {
    static Error(type) {
        switch (type) {
            case 1:
                throw new Error(`Shawn's first argument (Database) must exist.`);
            case 2:
                throw new Error(`Shawn's second argument (User) must exist.`);
            case 3:
                throw new Error(`Shawn's first argument (User) must exist.`);
            case 4:
                throw new Error(`Shawn's second argument (Type) must be valid.`);
            default:
                throw new Error('Invalid Shawn error code.');
        }
    }
    static async OnDutyStatus({ database = null, user = null }) {
        if (database = null)
            Shawn.Error(1);
        if (user = null)
            Shawn.Error(2);
        return await database.get(`shifts.${user}.${Seth.OnDutyDuration}`);
    }
    static async OnBreakStatus({ database = null, user = null }) {
        if (database = null)
            Shawn.Error(1);
        if (user = null)
            Shawn.Error(2);
        return await database.get(`shifts.${user}.${Seth.OnBreakStatus}`);
    }
    static async OnDutyDuration({ database = null, user = null }) {
        if (database = null)
            Shawn.Error(1);
        if (user = null)
            Shawn.Error(2);
        return await database.get(`shifts.${user}.${Seth.OnDutyDuration}`);
    }
    static async OnBreakDuration({ database = null, user = null }) {
        if (database = null)
            Shawn.Error(1);
        if (user = null)
            Shawn.Error(2);
        return await database.get(`shifts.${user}.${Seth.OnBreakDuration}`);
    }
    static async TotalShifts({ database = null, user = null }) {
        if (database = null)
            Shawn.Error(1);
        if (user = null)
            Shawn.Error(2);
        return await database.get(`shifts.${user}.${Seth.TotalShifts}`);
    }
    constructor(database) {
        this.database = database;
    }
    async update(user) {
        if (user = null)
            throw new Error(`Shawn's first argument (User) must exist.`);
        throw new Error(`Failed to update ${user}.`);
    }
    async fetchDuration({ user = null, type = null }) {
        if (user = null)
            Shawn.Error(3);
        switch (type) {
            case null:
                return {
                    onDuty: await Shawn.OnDutyDuration({ database: this.database, user: user }),
                    onBreak: await Shawn.OnBreakDuration({ database: this.database, user: user })
                };
            case Seth.OnDutyDuration:
                return await Shawn.OnDutyDuration({ database: this.database, user: user });
            case Seth.OnBreakDuration:
                return await Shawn.OnBreakDuration({ database: this.database, user: user });
            default:
                Shawn.Error(4);
        }
    }
    async fetchStatus({ user = null, type = null }) {
        if (user = null)
            Shawn.Error(3);
        switch (type) {
            case null:
                return {
                    onDuty: await Shawn.OnDutyStatus({ database: this.database, user: user }),
                    onBreak: await Shawn.OnBreakStatus({ database: this.database, user: user })
                };
            case Seth.OnDutyStatus:
                return await Shawn.OnDutyStatus({ database: this.database, user: user });
            case Seth.OnBreakStatus:
                return await Shawn.OnBreakStatus({ database: this.database, user: user });
            default:
                Shawn.Error(4);
        }
    }
    async fetchTotalShifts(user) {
        if (user = null)
            Shawn.Error(3);
        return await Shawn.TotalShifts({ database: this.database, user: user });
    }
    async fetchAll(member) {
        return {
            status: {
                onDuty: await database.get(`shifts.${member.id}.${Seth.OnDutyStatus}`),
                onBreak: await database.get(`shifts.${member.id}.${Seth.OnBreakStatus}`)
            },
            duration: {
                onDuty: await database.get(`shifts.${member.id}.${Seth.OnDutyDuration}`),
                onBreak: await database.get(`shifts.${member.id}.${Seth.OnBreakDuration}`)
            },
            total: await database.get(`shifts.${member.id}.${Seth.TotalShifts}`)
        };
    };
}