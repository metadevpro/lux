import { Injectable } from '@angular/core';

/**
 * A service that holds the functionality for advanced handling of regular expressions
 */
@Injectable({ providedIn: 'root' })
export class RegexpService {
  constructor() {}

  private joinStrings(
    stringArray: string[],
    startIndex: number,
    endIndex: number
  ): string {
    let result = '';
    for (
      let joinStringsIndex = startIndex;
      joinStringsIndex < endIndex;
      ++joinStringsIndex
    ) {
      result += stringArray[joinStringsIndex];
    }
    return result;
  }

  private removeOuterRoundBrackets(regularExpressionString: string): string {
    while (
      regularExpressionString[0] === '(' &&
      regularExpressionString[regularExpressionString.length - 1] === ')'
    ) {
      regularExpressionString = regularExpressionString.slice(
        1,
        regularExpressionString.length - 1
      );
    }
    return regularExpressionString;
  }

  private isQuantifier(quantifier: string): boolean {
    switch (quantifier) {
      case '{':
      case '?':
      case '+':
      case '*':
        return true;
    }
    return false;
  }

  private parseMinimalAmountOfQuantifier(quantifier: string): number {
    switch (quantifier[0]) {
      case '?':
      case '*':
        return 0;
      case '+':
        return 1;
      case '{':
        for (
          let parseMinimalAmountOfQuantifierIndex = 1;
          parseMinimalAmountOfQuantifierIndex < quantifier.length;
          ++parseMinimalAmountOfQuantifierIndex
        ) {
          if (
            quantifier[parseMinimalAmountOfQuantifierIndex] < '0' ||
            quantifier[parseMinimalAmountOfQuantifierIndex] > '9'
          ) {
            return Number(
              quantifier.slice(1, parseMinimalAmountOfQuantifierIndex)
            );
          }
        }
    }
    return 0;
  }

  private sliceRegexByOr(regularExpressionString: string): string[] {
    const result = [];
    let slicedRegex = '';
    let lastSliceIndex = 0;
    let roundBracketCount = 0;
    let squareBracketCount = 0;
    let curlyBracketCount = 0;
    let sliceRegexByOrIndex = 0;
    for (
      ;
      sliceRegexByOrIndex < regularExpressionString.length;
      ++sliceRegexByOrIndex
    ) {
      switch (regularExpressionString[sliceRegexByOrIndex]) {
        case '\\':
          // escape sequence; skip the next character
          ++sliceRegexByOrIndex;
          break;
        case '(':
          roundBracketCount += 1;
          break;
        case ')':
          roundBracketCount -= 1;
          break;
        case '[':
          squareBracketCount += 1;
          break;
        case ']':
          squareBracketCount -= 1;
          break;
        case '{':
          curlyBracketCount += 1;
          break;
        case '}':
          curlyBracketCount -= 1;
          break;
        case '|':
          if (
            roundBracketCount === 0 &&
            squareBracketCount === 0 &&
            curlyBracketCount === 0
          ) {
            slicedRegex = this.removeOuterRoundBrackets(
              regularExpressionString.slice(lastSliceIndex, sliceRegexByOrIndex)
            );
            result.push(slicedRegex);
            lastSliceIndex = sliceRegexByOrIndex + 1;
          }
          break;
      }
    }
    slicedRegex = this.removeOuterRoundBrackets(
      regularExpressionString.slice(lastSliceIndex, sliceRegexByOrIndex)
    );
    result.push(slicedRegex);
    return result;
  }

  private sliceRegexByThen(regularExpressionString: string): string[] {
    const result = [];
    let slicedRegex = '';
    let lastSliceIndex = 0;
    let roundBracketCount = 0;
    let squareBracketCount = 0;
    let curlyBracketCount = 0;
    for (
      let sliceRegexByThenIndex = 0;
      sliceRegexByThenIndex < regularExpressionString.length;
      ++sliceRegexByThenIndex
    ) {
      switch (regularExpressionString[sliceRegexByThenIndex]) {
        case '\\':
          // escape sequence; skip the next character
          ++sliceRegexByThenIndex;
          break;
        case '(':
          roundBracketCount += 1;
          break;
        case ')':
          roundBracketCount -= 1;
          break;
        case '[':
          squareBracketCount += 1;
          break;
        case ']':
          squareBracketCount -= 1;
          break;
        case '{':
          curlyBracketCount += 1;
          break;
        case '}':
          curlyBracketCount -= 1;
          break;
      }
      if (
        roundBracketCount === 0 &&
        squareBracketCount === 0 &&
        curlyBracketCount === 0
      ) {
        if (
          !this.isQuantifier(regularExpressionString[sliceRegexByThenIndex + 1])
        ) {
          slicedRegex = this.removeOuterRoundBrackets(
            regularExpressionString.slice(
              lastSliceIndex,
              sliceRegexByThenIndex + 1
            )
          );
          result.push(slicedRegex);
          lastSliceIndex = sliceRegexByThenIndex + 1;
        } else {
          if (regularExpressionString[sliceRegexByThenIndex + 1] === '{') {
            // regex without the quantifier
            slicedRegex = this.removeOuterRoundBrackets(
              regularExpressionString.slice(
                lastSliceIndex,
                sliceRegexByThenIndex + 1
              )
            );
            // minimal amount of repeats that the regex allows
            const minimalAmountOfRepeats = this.parseMinimalAmountOfQuantifier(
              regularExpressionString.slice(sliceRegexByThenIndex + 1)
            );
            // skip the quantifier if it's of the form {,}
            while (regularExpressionString[sliceRegexByThenIndex] !== '}') {
              sliceRegexByThenIndex = sliceRegexByThenIndex + 1;
            }
            // turn a regex of the form x{a,b} into xxxxxx... repeated a times
            for (let repeats = 0; repeats < minimalAmountOfRepeats; ++repeats) {
              result.push(slicedRegex);
            }
            lastSliceIndex = sliceRegexByThenIndex + 1;
          }
        }
      }
    }
    return result;
  }

  suggestOneCharacter(
    regularExpressionString: string,
    invert: boolean = false
  ): string {
    if (regularExpressionString[0] === '\\') {
      switch (regularExpressionString[1]) {
        case 'd':
          return invert ? 'a' : '0';
        case 'D':
          return invert ? '0' : 'a';
        case 's':
          return invert ? '_' : ' ';
        case 'S':
          return invert ? ' ' : '_';
        case 'w':
          return invert ? ' ' : '_';
        case 'W':
          return invert ? '_' : ' ';
        default:
          return regularExpressionString[1];
      }
    }
    if (
      regularExpressionString[0] === '[' ||
      regularExpressionString[0] === '('
    ) {
      return this.suggestOneCharacter(regularExpressionString.slice(1), invert);
    }
    if (regularExpressionString[0] === '^') {
      return this.suggestOneCharacter(
        regularExpressionString.slice(1),
        !invert
      );
    }
    return regularExpressionString[0];
  }

  suggestAllCharacters(regularExpressionString: string): string {
    const regexOptions = this.sliceRegexByOr(regularExpressionString);
    const regexParts = this.sliceRegexByThen(regexOptions[0]);
    if (regexOptions.length > 1 || regexParts.length > 1) {
      let suggestionResult = '';
      for (const regexPart of regexParts) {
        suggestionResult += this.suggestAllCharacters(regexPart);
      }
      return suggestionResult;
    } else {
      return this.suggestOneCharacter(regexParts[0]);
    }
    return '';
  }

  suggestion(beginning: string, regularExpressionString: string): string {
    if (new RegExp(regularExpressionString).test(beginning)) {
      return '';
    }
    const regexOptions = this.sliceRegexByOr(regularExpressionString);
    for (
      let regexOptionIndex = 0;
      regexOptionIndex < regexOptions.length;
      ++regexOptionIndex
    ) {
      const regexParts = this.sliceRegexByThen(regexOptions[regexOptionIndex]);
      if (regexOptions.length > 1 || regexParts.length > 1) {
        // for each option, test if the first part of the regex matches
        // if it doesn't, continue
        // if it does, keep checking until what part it matches
        if (!new RegExp(regexParts[0]).test(beginning)) {
          // if there are no more options
          if (regexOptionIndex === regexOptions.length - 1) {
            // we return the first option, but we could return any option
            return this.suggestAllCharacters(regexOptions[0]);
          }
        } else {
          for (
            let regexPartIndex = 1;
            regexPartIndex < regexParts.length;
            ++regexPartIndex
          ) {
            if (
              !new RegExp(
                this.joinStrings(regexParts, 0, regexPartIndex + 1)
              ).test(beginning)
            ) {
              const remainingRegexToBeMatched = this.joinStrings(
                regexParts,
                regexPartIndex,
                regexParts.length
              );
              return this.suggestAllCharacters(remainingRegexToBeMatched);
            }
          }
        }
      } else {
        // there's only one part and one option, so a suggestion can be trivial
        return this.suggestOneCharacter(regexParts[0]);
      }
    }
    return '';
  }
}
