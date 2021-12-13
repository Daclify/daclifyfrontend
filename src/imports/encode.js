import Long from 'long';

export function bytesToHex(bytes) {
  let leHex = '';
  for (const b of bytes) {
    const n = Number(b).toString(16);
    leHex += (n.length === 1 ? '0' : '') + n;
  }
  return leHex;
}

const charmap = '.12345abcdefghijklmnopqrstuvwxyz';
const charidx = ch => {
  const idx = charmap.indexOf(ch);
  if (idx === -1) throw new TypeError(`Invalid character: '${ch}'`);

  return idx;
};

export function nameToValue(name) {

  let bitstr = '';
  for (let i = 0; i <= 12; i++) {
    // process all 64 bits (even if name is short)
    const c = i < name.length ? charidx(name[i]) : 0;
    const bitlen = i < 12 ? 5 : 4;
    let bits = Number(c).toString(2);
    if (bits.length > bitlen) {
      throw new TypeError('Invalid name ' + name);
    }
    bits = '0'.repeat(bitlen - bits.length) + bits;
    bitstr += bits;
  }

  return Long.fromString(bitstr, true, 2);
}

export function getTableBoundsForName(name, asHex = true) {
  const nameValue = nameToValue(name);
  const nameValueP1 = nameValue.add(1);

  if(!asHex) {
    return {
      lower_bound: nameValue.toString(),
      upper_bound: nameValueP1.toString()
    };
  }

  const lowerBound = bytesToHex(nameValue.toBytesLE());
  const upperBound = bytesToHex(nameValueP1.toBytesLE());
  return {
    lower_bound: lowerBound,
    upper_bound: upperBound
  };
}