import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export class ObjectStateContainer<T> {
    private currentStateSubject = new BehaviorSubject<T>(undefined);
    private $currentState = this.currentStateSubject.asObservable();

    public $isDirty = this.$currentState.pipe(map(t => this.isDirty(t)));

    constructor(public t: T, private propertiesToWatch: (keyof T)[]) {
        this.updateT(t);
    }

    undoChanges() {
        this.updateT(this.t);
        this.setWatch(this, 't', (obj, _) => this.updateT(obj.t));
    }

    private isDirty(t: T): boolean {
        return !!this.t
            && !!t
            && this.propertiesToWatch
                    .reduce((pv, cv) => pv || this.t[cv] !== t[cv], false);
    }

    private updateT(t: T) {
        const tCopy = this.shallowClone(t);

        this.propertiesToWatch
            .forEach(key => this.setWatch(tCopy, key, (cmd, _) => this.currentStateSubject.next(cmd)));

        this.currentStateSubject.next(tCopy);
    }

    private setWatch<T>(obj: T, key: keyof T, callback: (obj: T, val: any) => void) {
        const currentValue = obj[key];

        const privatePropertyName = `__${key}`;
        Object.defineProperty(
                obj,
                key,
                {
                    get: function() {
                      return this[privatePropertyName];
                    },
                    set: function(val) {
                        this[privatePropertyName] = val;
                        callback(obj, val);
                    }
                }
            );

        obj[privatePropertyName] = currentValue;
      }

      private shallowClone(t: T): T {
          return JSON.parse(JSON.stringify(t));
      }
}
