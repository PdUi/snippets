import { ObjectStateContainer } from './object-state-container';
import { TestScheduler } from 'rxjs/testing';

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

    /*
        SAME TEST AS ONE BELOW
        This is a non-marble test example.
    */
    it('should be constructed with isDirty as false', done => {
        const objectStateContainer = new ObjectStateContainer(new TestObject(), ['string', 'number', 'boolean']);
        objectStateContainer
            .$isDirty
            .subscribe(isDirty => {
                expect(isDirty).toBe(false);
                done();
            });
    });

    /*
        SAME TEST AS ONE ABOVE
        This is a 'marble' test example.
    */
    it('should be constructed with isDirty as false', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject(), ['string', 'number', 'boolean']);
            const expectedMarble = 'd';
            const expectedIsDirty = { d: false };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
        });
    });

    it('should be constructed with isDirty as false and object.boolean should have initialized value', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject({ boolean: true }), ['boolean']);
            const expectedMarble = 'd';
            const expectedIsDirty = { d: false };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
            expect(objectStateContainer.t.boolean).toBe(true);
        });
    });

    it('should be constructed with isDirty as false and object.number should have initialized value', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject({ number: Number.MAX_VALUE }), ['number']);
            const expectedMarble = 'd';
            const expectedIsDirty = { d: false };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
            expect(objectStateContainer.t.number).toBe(Number.MAX_VALUE);
        });
    });

    it('should be constructed with isDirty as false and object.string should have initialized value', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject({ string: 'string' }), ['string']);
            const expectedMarble = 'd';
            const expectedIsDirty = { d: false };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
            expect(objectStateContainer.t.string).toBe('string');
        });
    });

    it('should change isDirty to true when testObject.boolean is updated', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject(), ['boolean']);
            objectStateContainer.t.boolean = true;
            const expectedMarble = 'd';
            const expectedIsDirty = { d: true };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
        });
    });

    it('should change isDirty to true when testObject.boolean is updated', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject({ boolean: false }), ['boolean']);
            objectStateContainer.t.boolean = true;
            const expectedMarble = 'd';
            const expectedIsDirty = { d: true };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
        });
    });

    it('should change isDirty to true when testObject.number is updated', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject(), ['number']);
            objectStateContainer.t.number = Number.MAX_VALUE;
            const expectedMarble = 'd';
            const expectedIsDirty = { d: true };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
        });
    });

    it('should change isDirty to true when testObject.number is updated', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject({ number: Number.MIN_VALUE }), ['number']);
            objectStateContainer.t.number = Number.MAX_VALUE;
            const expectedMarble = 'd';
            const expectedIsDirty = { d: true };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
        });
    });

    it('should change isDirty to true when testObject.string is updated', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject(), ['string']);
            objectStateContainer.t.string = 'string';
            const expectedMarble = 'd';
            const expectedIsDirty = { d: true };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
        });
    });

    it('should change isDirty to true when testObject.string is updated', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject({ string: 'strng' }), ['string']);
            objectStateContainer.t.string = 'string';
            const expectedMarble = 'd';
            const expectedIsDirty = { d: true };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
        });
    });

    it('should change isDirty to false when testObject changes are undone', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject(), ['string', 'number', 'boolean']);
            objectStateContainer.t.string = 'string';
            objectStateContainer.undoChanges();

            const expectedMarble = 'd';
            const expectedIsDirty = { d: false };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
        });
    });

    it('should change isDirty to false when object reference is updated but property values remain the same', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject(), ['string', 'number', 'boolean']);
            objectStateContainer.t = new TestObject();
            const expectedMarble = 'd';
            const expectedIsDirty = { d: false };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
        });
    });

    it('should change isDirty to true when object reference is updated and property change', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject(), ['string', 'number', 'boolean']);
            objectStateContainer.t = new TestObject({ string: 'string' });
            const expectedMarble = 'd';
            const expectedIsDirty = { d: true };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
        });
    });

    it('should change isDirty to true when object reference is updated and then property value is changed on new object reference', () => {
        scheduler.run(({ expectObservable }) => {
            const objectStateContainer = new ObjectStateContainer(new TestObject(), ['string', 'number', 'boolean']);
            objectStateContainer.t = new TestObject();
            objectStateContainer.t.string = 'string';
            const expectedMarble = 'd';
            const expectedIsDirty = { d: true };
            expectObservable(objectStateContainer.$isDirty).toBe(expectedMarble, expectedIsDirty);
        });
    });
});
