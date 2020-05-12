import { ObjectStateContainer } from './object-state-container';
import { TestScheduler } from 'rxjs/testing';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

class TestObject {
    boolean: boolean;
    number: number;
    string: string;

    constructor(object: Partial<TestObject> = { boolean: undefined, number: undefined, string: undefined }) {
        this.boolean = object.boolean;
        this.number = object.number;
        this.string = object.string
    }
}

describe('ObjectStateContainer', () => {
    let scheduler: TestScheduler;

    beforeEach(() =>
        scheduler = new TestScheduler((actual, expected) =>
        {
            expect(actual).toEqual(expected);
        })
    );

    it('should be constructed with isDirty as false', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject());
            const expectedMarble = 'a';
            const expectedIsDirty = { a: false };
            expectObservable(objectStateContainer.isDirty$).toBe(expectedMarble, expectedIsDirty);
        });
    });

    it('should be constructed with isDirty as false and object.boolean should have initialized value', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject({ boolean: true }), ['boolean']);
            const expectedMarble = 'd';
            const expectedIsDirty = { d: false };
            expectObservable(objectStateContainer.isDirty$).toBe(expectedMarble, expectedIsDirty);
            expect(objectStateContainer.t.boolean).toBe(true);
        });
    });

    it('should be constructed with isDirty as false and object.number should have initialized value', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject({ number: Number.MAX_VALUE }), ['number']);
            const expectedMarble = 'd';
            const expectedIsDirty = { d: false };
            expectObservable(objectStateContainer.isDirty$).toBe(expectedMarble, expectedIsDirty);
            expect(objectStateContainer.t.number).toBe(Number.MAX_VALUE);
        });
    });

    it('should be constructed with isDirty as false and object.string should have initialized value', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject({ string: 'string' }), ['string']);
            const expectedMarble = 'd';
            const expectedIsDirty = { d: false };
            expectObservable(objectStateContainer.isDirty$).toBe(expectedMarble, expectedIsDirty);
            expect(objectStateContainer.t.string).toBe('string');
        });
    });

    it('should change isDirty to true when testObject.boolean is updated', () => {
        scheduler.run(({ expectObservable, cold }) => {
            const t1 = new TestObject();
            const container = new ObjectStateContainer(t1, ['boolean']);

            const makeDirty$ =  cold('----(b|)', { b: t1 }).pipe(tap(() => container.t.boolean = true));

            const expected = 'a---b';
            
            const expectedEvents = '----(b|)';
            const stateValues = { a: false, b: true };

            expectObservable(makeDirty$).toBe(expectedEvents, { b: t1 });
            expectObservable(container.isDirty$).toBe(expected, stateValues);
        });
    });

    it('should change isDirty to true when testObject.boolean is updated', () => {
        scheduler.run(({ expectObservable, cold }) => {
            const t1 = new TestObject({ boolean: false });
            const container = new ObjectStateContainer(t1, ['boolean']);

            const makeDirty$ =  cold('----(b|)', { b: t1 }).pipe(tap(() => container.t.boolean = true));

            const expected = 'a---b';
            
            const expectedEvents = '----(b|)';
            const stateValues = { a: false, b: true };

            expectObservable(makeDirty$).toBe(expectedEvents, { b: t1 });
            expectObservable(container.isDirty$).toBe(expected, stateValues);
        });
    });

    it('should change isDirty to true when testObject.number is updated', () => {
        scheduler.run(({ expectObservable, cold }) => {
            const t1 = new TestObject();
            const container = new ObjectStateContainer(t1, ['number']);

            const makeDirty$ =  cold('----(b|)', { b: t1 }).pipe(tap(() => container.t.number = Number.MAX_VALUE));

            const expected = 'a---b';
            
            const expectedEvents = '----(b|)';
            const stateValues = { a: false, b: true };

            expectObservable(makeDirty$).toBe(expectedEvents, { b: t1 });
            expectObservable(container.isDirty$).toBe(expected, stateValues);
        });
    });

    it('should change isDirty to true when testObject.number is updated', () => {
        scheduler.run(({ expectObservable, cold }) => {
            const t1 = new TestObject({ number: Number.MIN_VALUE });
            const container = new ObjectStateContainer(t1, ['number']);

            const makeDirty$ =  cold('----(b|)', { b: t1 }).pipe(tap(() => container.t.number = Number.MAX_VALUE));

            const expected = 'a---b';
            
            const expectedEvents = '----(b|)';
            const stateValues = { a: false, b: true };

            expectObservable(makeDirty$).toBe(expectedEvents, { b: t1 });
            expectObservable(container.isDirty$).toBe(expected, stateValues);
        });
    });

    it('should change isDirty to true when testObject.string is updated', () => {
        scheduler.run(({ expectObservable, cold }) => {
            const t1 = new TestObject();
            const container = new ObjectStateContainer(t1, ['string']);

            const makeDirty$ =  cold('----(b|)', { b: t1 }).pipe(tap(() => container.t.string = 'string'));

            const expected = 'a---b';
            
            const expectedEvents = '----(b|)';
            const stateValues = { a: false, b: true };

            expectObservable(makeDirty$).toBe(expectedEvents, { b: t1 });
            expectObservable(container.isDirty$).toBe(expected, stateValues);
        });
    });

    it('should change isDirty to true when testObject.string is updated', () => {
        scheduler.run(({ expectObservable, cold }) => {
            const t1 = new TestObject({ string: 'strng' });
            const container = new ObjectStateContainer(t1, ['string']);

            const makeDirty$ =  cold('----(b|)', { b: t1 }).pipe(tap(() => container.t.string = 'string'));

            const expected = 'a---b';
            
            const expectedEvents = '----(b|)';
            const stateValues = { a: false, b: true };

            expectObservable(makeDirty$).toBe(expectedEvents, { b: t1 });
            expectObservable(container.isDirty$).toBe(expected, stateValues);
        });
    });

    it('should change isDirty to false when testObject changes are undone', () => {
        scheduler.run(({ expectObservable, cold }) => {
            const t1 = new TestObject();
            const container = new ObjectStateContainer(t1, ['string']);

            const makeDirty$ =  cold('----(b|)', { b: t1 }).pipe(tap(() => container.t.string = 'string'));
            const undoChange$ = cold('----------(c|)', { c: t1 }).pipe(tap(() => container.undoChanges()));

            const expected = 'a---b-----c';
            const stateValues = { a: false, b: true, c: false };
            
            const events$ = merge(makeDirty$, undoChange$);
            const expectedEvents = '----b-----(c|)';

            expectObservable(events$).toBe(expectedEvents, { b: t1, c: t1 });
            expectObservable(container.isDirty$).toBe(expected, stateValues);
        });
    });

    it('should change isDirty to false when object reference is updated but property values remain the same', () => {
        scheduler.run(({ expectObservable, cold }) => {
            const t1 = new TestObject();
            const t2 = new TestObject();
            const container = new ObjectStateContainer(t1);

            const makeDirty$ =  cold('----(b|)', { b: t2 }).pipe(tap(t => container.t = t));

            const expected = 'a---b';
            
            const expectedEvents = '  ----(b|)';
            const stateValues = { a: false, b: false };

            expectObservable(makeDirty$).toBe(expectedEvents, { b: t2 });
            expectObservable(container.isDirty$).toBe(expected, stateValues);
        });
    });

    it('should change isDirty to true when object reference is updated and property change', () => {
        scheduler.run(({ expectObservable, cold }) => {
            const t1 = new TestObject();
            const t2 = new TestObject();
            const container = new ObjectStateContainer(t1, ['string']);

            const makeDirty$ =  cold('-(b|)', { b: t2 }).pipe(tap(() => container.t = t2));
            const changePropertyValue$ =  cold('--(c|)', { c: t2 }).pipe(tap(() => container.t.string = 'string'));
            
            const expected = 'abc';
            const stateValues = { a: false, b: false, c: true };
            
            const events$ = merge(makeDirty$, changePropertyValue$);
            const expectedEvents = '-b(c|)';

            expectObservable(events$).toBe(expectedEvents, { b: t2, c: t2 });
            expectObservable(container.isDirty$).toBe(expected, stateValues);
        });
    });
});
