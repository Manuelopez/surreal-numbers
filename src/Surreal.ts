export class Surreal {
  leftSet: Set<number>;
  rightSet: Set<number>;

  constructor(leftSet: Set<number>, rightSet: Set<number>) {
    this.isWellFormed(leftSet, rightSet);
    this.leftSet = leftSet;
    this.rightSet = rightSet;
  }

  private isWellFormed(leftSet: Set<number>, rightSet: Set<number>) {
    for (let l of leftSet) {
      for (let r of rightSet) {
        if (l >= r) {
          throw new Error('Bad Formed');
        }
      }
    }
  }

  private static gcd(a: any, b: any): any {
    return b ? this.gcd(b, a % b) : a;
  }
  private static decimalToFraction(_decimal: any) {
    if (_decimal == parseInt(_decimal)) {
      return {
        top: parseInt(_decimal),
        bottom: 1,
        display: parseInt(_decimal) + '/' + 1,
      };
    } else {
      var top = _decimal.toString().includes('.')
        ? _decimal.toString().replace(/\d+[.]/, '')
        : 0;
      var bottom = Math.pow(10, top.toString().replace('-', '').length);
      if (_decimal >= 1) {
        top = +top + Math.floor(_decimal) * bottom;
      } else if (_decimal <= -1) {
        top = +top + Math.ceil(_decimal) * bottom;
      }

      var x = Math.abs(this.gcd(top, bottom));
      return {
        top: top / x,
        bottom: bottom / x,
        display: top / x + '/' + bottom / x,
      };
    }
  }

  static formNumber(num: number) {
    if (num % 1 !== 0) {
      console.log('ran');
      const frac = this.decimalToFraction(0.5);
      const k = Math.log2(frac.bottom);
      return new Surreal(
        new Set([num - Math.pow(1 / 2, k)]),
        new Set([num + Math.pow(1 / 2, k)])
      );
    }

    if (num == 0) {
      return new Surreal(new Set(), new Set());
    }
    if (num > 0) {
      return new Surreal(new Set([num - 1]), new Set());
    } else {
      return new Surreal(new Set(), new Set([num + 1]));
    }
  }

  toString() {
    return `{ ${Array.from(this.leftSet).join(', ')} | ${Array.from(
      this.rightSet
    ).join(',')} }`;
  }

  calcValue() {
    const l = Array.from(this.leftSet);
    const r = Array.from(this.rightSet);

    if (l.length == 0 && r.length == 0) {
      return 0;
    } else if (l.length == 0 && r.length == 1) {
      return r[0] - 1;
    } else if (r.length == 0 && l.length == 1) {
      return l[0] + 1;
    } else if (l.length === 1 && r.length === 1) {
      return (l[0] + r[0]) / 2;
    } else {
      //TODO CALC SEQUENCE
    }
  }

  static negate(num: Surreal) {
    let l = Array.from(num.leftSet);
    let r = Array.from(num.rightSet);
    l = l.map((x) => x * -1);
    r = r.map((x) => x * -1);
    return new Surreal(new Set(r), new Set(l));
  }

  static add(num1: Surreal, num2: Surreal) {
    // INCORRECT DOES NOT WORK WITH SEQUENCE
    let n1l = Array.from(num1.leftSet);
    let n1r = Array.from(num1.rightSet);
    let n2l = Array.from(num2.leftSet);
    let n2r = Array.from(num2.rightSet);
    let n1Val = num1.calcValue();
    let n2Val = num2.calcValue();

    n1l = n1l.map((x) => x + n2Val!);
    n2l = n2l.map((x) => x + n1Val!);

    n1r = n1r.map((x) => x + n2Val!);
    n2r = n2r.map((x) => x + n1Val!);

    console.log(n1l.concat(n2l));

    return new Surreal(new Set(n1l.concat(n2l)), new Set(n1r.concat(n2r)));
  }

  static multiply(x: Surreal, y: Surreal) {
    // MAKE IT WORK WITH SEQUENCE
    let xL = Array.from(x.leftSet);
    let xR = Array.from(x.rightSet);
    let yL = Array.from(y.leftSet);
    let yR = Array.from(y.rightSet);
    let xVal = x.calcValue();
    let yVal = y.calcValue();
    let left = [
      xL[0] * yVal! + yL[0] * xVal! - xL[0] * yL[0],
      xR[0] * yVal! + xVal! * yR[0] - xR[0] * yR[0],
    ];

    let right = [
      xL[0] * yVal! + xVal! * yR[0] - xL[0] * yR[0],
      xVal! * yL[0] + xR[0] * yVal! - xR[0] * yL[0],
    ];

    return new Surreal(new Set(left), new Set(right));
  }

  private static getAllSubsets(set: number[]) {
    const arr: number[] = [];
    return set.reduce(
      (subsets, value) => subsets.concat(subsets.map((set) => [value, ...set])),
      [arr]
    );
  }

  static *generate(birthday: number) {
    let nBirthday = 0;
    let formSeen = new Set<number>();

    while (nBirthday <= birthday) {
      let forms = this.getAllSubsets(Array.from(formSeen));
      for (let l of forms) {
        for (let r of forms) {
          try {
            let sur = new Surreal(new Set(l), new Set(r));
            console.log(formSeen.has(sur.calcValue()!));
            if (!formSeen.has(sur.calcValue()!)) formSeen.add(sur.calcValue()!);
            console.log(forms);
            yield sur;
          } catch (error) {
            continue;
          }
        }
      }

      console.log(
        `Birthday on ${nBirthday} [${Array.from(formSeen).join(', ')}]`
      );

      nBirthday++;
    }
  }

  //DIVISION NEEDS SEQUENCE MULTIPLICATION
}
