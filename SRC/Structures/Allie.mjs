export class Allie {
    static basename(path, ext) {
        const res = parse(path);
        return ext && res.ext.startsWith(ext) ? res.name : res.base.split('?')[0];
    }
    static flatten(obj, ...props) {
        if (!isObject(obj)) return obj;
        const objProps = Object.keys(obj)
        .filter(k => !k.startsWith('_'))
        .map(k => ({ [k]: true }));
        props = objProps.length ? Object.assign(...objProps, ...props) : Object.assign({}, ...props);
        const out = {};
        for (let [prop, newProp] of Object.entries(props)) {
            if (!newProp) continue;
            newProp = newProp === true ? prop : newProp;
            const element = obj[prop];
            const elemIsObj = isObject(element);
            const valueOf = elemIsObj && typeof element.valueOf === 'function' ? element.valueOf() : null;
            const hasToJSON = elemIsObj && typeof element.toJSON === 'function';
            if (Array.isArray(element)) out[newProp] = element.map(e => e.toJSON?.() ?? flatten(e));
            else if (typeof valueOf !== 'object') out[newProp] = valueOf;
            else if (hasToJSON) out[newProp] = element.toJSON();
            else if (typeof element === 'object') out[newProp] = flatten(element);
            else if (!elemIsObj) out[newProp] = element;
        }
        return out;
    }
    static normalizeArray(arr) {
        const finalArr = [];
        if (Array.isArray(arr[0])){ 
            console.log('a')
            return arr[0]
        };
        return arr.forEach(arr => finalArr.push(arr));
    }
    static validateFieldLength(amountAdding, fields) {
        var _a;
        fieldLengthPredicate.parse(((_a = fields === null || fields === void 0 ? void 0 : fields.length) !== null && _a !== void 0 ? _a : 0) + amountAdding);
    }
    static color(color) {
        const colors = {
            Default: 0x000000,
            White: 0xffffff,
            Aqua: 0x1abc9c,
            Green: 0x57f287,
            Blue: 0x3498db,
            Yellow: 0xfee75c,
            Purple: 0x9b59b6,
            LuminousVividPink: 0xe91e63,
            Fuchsia: 0xeb459e,
            Gold: 0xf1c40f,
            Orange: 0xe67e22,
            Red: 0xed4245,
            Grey: 0x95a5a6,
            Navy: 0x34495e,
            DarkAqua: 0x11806a,
            DarkGreen: 0x1f8b4c,
            DarkBlue: 0x206694,
            DarkPurple: 0x71368a,
            DarkVividPink: 0xad1457,
            DarkGold: 0xc27c0e,
            DarkOrange: 0xa84300,
            DarkRed: 0x992d22,
            DarkGrey: 0x979c9f,
            DarkerGrey: 0x7f8c8d,
            LightGrey: 0xbcc0c0,
            DarkNavy: 0x2c3e50,
            Blurple: 0x5865f2,
            Greyple: 0x99aab5,
            DarkButNotBlack: 0x2c2f33,
            NotQuiteBlack: 0x23272a,
        }
        if (typeof color === 'string') {
            if (color === 'Random') return Math.floor(Math.random() * (0xffffff + 1));
            if (color === 'Default') return 0;
            if (/^#?[\da-f]{6}$/i.test(color)) return parseInt(color.replace('#', ''), 16);
            color = colors[color];
        } else if (Array.isArray(color)) {
            color = (color[0] << 16) + (color[1] << 8) + color[2];
        }
        if (color < 0 || color > 0xffffff) throw new Error("Allie's first argument (Color) must be within the range 0 - 16777215 (0xFFFFFF).");
        if (typeof color !== 'number' || Number.isNaN(color)) throw new Error("Allie is unable to its first argument (Color) to a number.")
        return color;
    };
};