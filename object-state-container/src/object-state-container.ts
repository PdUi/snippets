import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export class ObjectStateContainer<T> {
    private pristineStateT: T;
    private __t: T;

    private currentStateSubject = new BehaviorSubject<T>(undefined);
    private currentState$ = this.currentStateSubject
                                .asObservable();

    public get t(): T {
        return this.__t;
    }

    public set t(t: T) {
        this.propertiesToWatch
            .forEach(key => this.setWatch(t, key, (o, _) => this.currentStateSubject.next(o)));

        this.currentStateSubject.next(t);

        this.__t = t;
    }

    public isDirty$ = this.currentState$
                          .pipe(
                              map(t => this.isDirty(t))
                          );

    constructor(t: T, private propertiesToWatch: (keyof T)[] = []) {
        this.updateT(t);
        this.__t = t;
    }

    undoChanges() {
        this.updateT(this.pristineStateT);
    }

    private isDirty(t: T): boolean {
        return !!this.t
            && !!t
            && this.propertiesToWatch
                    .reduce((pv, cv) => pv || this.pristineStateT[cv] !== t[cv], false);
    }

    private updateT(t: T) {
        this.propertiesToWatch
            .forEach(key => this.setWatch(t, key, (o, _) => this.currentStateSubject.next(o)));

        this.currentStateSubject.next(t);
        this.pristineStateT = this.shallowClone(t);
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
