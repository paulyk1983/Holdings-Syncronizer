import { expect } from 'chai';
import { buildMockTitleProperty } from '../../test/utils';
import { ImportedFidelityProperties, NumberProperty, RichTextProperty, RichTextPropertyWrite, TitlePropertyWrite } from '../types/notion.types';
import { buildNumberProperty, buildRichTextProperty, buildTitleProperty, getTitleValue, transformFidelityPageProperties } from './notion-service';
import {Chance} from 'chance'
import { buildPageFromImportedFidelityDatabase } from '../../test/mocks/notion';
import { dollarStringToNumber } from './helpers';

const chance = new Chance();

describe('dollarStringToNumber()', () => {
    it('should return a number given a convertable dollar string amount with $ prefixed', () => {
        const number = chance.natural()
        const result = dollarStringToNumber(`$${number}`)

        expect(result).to.equal(number)
    });

    it('should return a number given a convertable dollar string amount without $', () => {
        const number = chance.natural()
        const result = dollarStringToNumber(`${number}`)

        expect(result).to.equal(number)
    });

    it('should return null given a string that is not convertable', () => {
        const number = 40.01
        const result = dollarStringToNumber(`abc${number}`)

        expect(result).to.equal(null)
    });
});