import { expect } from 'chai';
import { buildMockTitleProperty } from '../../test/utils';
import { ImportedFidelityProperties, NumberProperty, RichTextProperty, RichTextPropertyWrite, TitlePropertyWrite } from '../types/notion.types';
import { buildNumberProperty, buildRichTextProperty, buildTitleProperty, getTitleValue, transformFidelityPageProperties } from './notion-service';
import {Chance} from 'chance'
// import { buildPageFromImportedFidelityDatabase } from '../../test/mocks/notion';

const chance = new Chance();

describe('getTitleValue()', () => {
    it('should return the title value as a string', () => {
        const mocktitleValue = chance.string({length:3})
        const titleObject = buildMockTitleProperty(mocktitleValue)
        const titleValue = getTitleValue(titleObject)

        expect(titleValue).to.equal(mocktitleValue)
    });
});

describe('buildNumberProperty()', () => {
    it('should return a Notion number property object given a number', () => {
        const number = chance.floating()
        const numberProperty:NumberProperty = buildNumberProperty(number)

        expect(numberProperty.number).to.equal(number)
        expect(numberProperty.type).to.equal("number")
        expect(numberProperty.id).to.equal(undefined)
    });

    it('should return a Notion number property object given a stringified number', () => {
        const number = chance.floating()
        const numberProperty:NumberProperty = buildNumberProperty(`${number}`)

        expect(numberProperty.number).to.equal(number)
        expect(numberProperty.type).to.equal("number")
        expect(numberProperty.id).to.equal(undefined)
    });

    it('should return a Notion number property object given a stringified number prefixed with "$"', () => {
        const number = chance.floating()
        const numberProperty:NumberProperty = buildNumberProperty(`$${number}`)

        expect(numberProperty.number).to.equal(number)
        expect(numberProperty.type).to.equal("number")
        expect(numberProperty.id).to.equal(undefined)
    });

    it('should return a Notion number property object with number value of 0, given an unsupported string', () => {
        const unsupportedString = chance.string({ pool: 'abcde' })
        const numberProperty:NumberProperty = buildNumberProperty(unsupportedString)

        expect(numberProperty.number).to.equal(0)
        expect(numberProperty.type).to.equal("number")
        expect(numberProperty.id).to.equal(undefined)
    });
});

describe('buildRichTextProperty()', () => {
    it('should return a Notion rich text property for request object given a string', () => {
        const textPropertyValue = chance.string({ pool: 'abcde' })
        const richTextProperty:RichTextPropertyWrite = buildRichTextProperty(textPropertyValue)

        expect(richTextProperty.id).to.equal(undefined)
        expect(richTextProperty.type).to.equal("rich_text")
        expect(richTextProperty.rich_text.length).to.equal(1)
        expect(richTextProperty.rich_text[0].text.content).to.equal(textPropertyValue)
    });

    it('should return a Notion rich text property for request object given a string and an id', () => {
        const textPropertyValue = chance.string({ pool: 'abcde' })
        const id = chance.string({ pool: 'abcde12345' })
        const richTextProperty:RichTextPropertyWrite = buildRichTextProperty(textPropertyValue, id)

        expect(richTextProperty.id).to.equal(id)
        expect(richTextProperty.type).to.equal("rich_text")
        expect(richTextProperty.rich_text.length).to.equal(1)
        expect(richTextProperty.rich_text[0].text.content).to.equal(textPropertyValue)
    });
});

describe('buildTitleProperty()', () => {
    it('should return a Notion title property for request object given a string', () => {
        const titlePropertyValue = chance.string({ pool: 'abcde' })
        const titleProperty:TitlePropertyWrite = buildTitleProperty(titlePropertyValue)

        expect(titleProperty.id).to.equal(undefined)
        expect(titleProperty.type).to.equal("title")
        expect(titleProperty.title.length).to.equal(1)
        expect(titleProperty.title[0].text.content).to.equal(titlePropertyValue)
    });

    it('should return a Notion title property for request object given a string and an id', () => {
        const textPropertyValue = chance.string({ pool: 'abcde' })
        const id = chance.string({ pool: 'abcde12345' })
        const titleProperty:TitlePropertyWrite = buildTitleProperty(textPropertyValue, id)

        expect(titleProperty.id).to.equal(id)
        expect(titleProperty.type).to.equal("title")
        expect(titleProperty.title.length).to.equal(1)
        expect(titleProperty.title[0].text.content).to.equal(textPropertyValue)
    });
});

// describe.skip('transformFidelityPageProperties()', () => {
//     it('maps data for a create request', () => {
//         // build imported page
//         const importedFidelityPage:ImportedFidelityProperties = buildPageFromImportedFidelityDatabase()
//         const currentPriceValue:string = importedFidelityPage['Last Price'].rich_text[0].plain_text
//         const enhancedFidelityPage = transformFidelityPageProperties(importedFidelityPage)

//         expect(enhancedFidelityPage['Current Price']).to.be.an("object").to.have.property("number").to.equal(2)
//     })
// })

// Chai assertion examples:
// expect(options.detectRetina).to.be.false
// expect(options.interactivity.modes.emitters).to.be.empty
// expect(options.particles.color).to.be.an("object").to.have.property("value").to.equal("#fff")