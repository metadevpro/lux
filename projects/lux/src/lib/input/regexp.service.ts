import { Injectable } from '@angular/core';

/**
 * A service that holds the functionality for advanced handling of regular expressions
 */
@Injectable({ providedIn: 'root' })
export class RegexpService {
  constructor() {}

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
        for (let index = 1; index < quantifier.length; ++index) {
          if (quantifier[index] < '0' || quantifier[index] > '9') {
            return Number(quantifier.slice(1, index));
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
    let index = 0;
    for (; index < regularExpressionString.length; ++index) {
      switch (regularExpressionString[index]) {
        case '\\':
          // escape sequence; skip the next character
          ++index;
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
              regularExpressionString.slice(lastSliceIndex, index)
            );
            result.push(slicedRegex);
            lastSliceIndex = index + 1;
          }
          break;
      }
    }
    slicedRegex = this.removeOuterRoundBrackets(
      regularExpressionString.slice(lastSliceIndex, index)
    );
    result.push(slicedRegex);
    return result;
  }

  private sliceRegexByThen(regularExpressionString: string): string[][] {
    // the actual result
    const resultStart = [];
    // the remainder of the regex in each case
    const resultRemainder = [];
    let roundBracketCount = 0;
    let squareBracketCount = 0;
    let curlyBracketCount = 0;
    for (let index = 0; index < regularExpressionString.length; ++index) {
      switch (regularExpressionString[index]) {
        case '\\':
          // escape sequence; skip the next character
          ++index;
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
        if (!this.isQuantifier(regularExpressionString[index + 1])) {
          resultStart.push(regularExpressionString.slice(0, index + 1));
          resultRemainder.push(regularExpressionString.slice(index + 1));
        } else {
          // let minimalAmountOfRepeats = parseMinimalAmountOfQuantifier(regularExpressionString.slice(index + 1));
          // TODO
        }
      }
    }
    return [resultStart, resultRemainder];
  }

  suggestion(beginning: string, regularExpressionString: string): string {
    if (new RegExp(regularExpressionString).test(beginning)) {
      // TODO: RETURN AN EMPTY STRING
      return 'YA ES IGUAL, NO HAY MÁS QUE SUGERIR';
    }
    const regexOptions = this.sliceRegexByOr(regularExpressionString);
    if (regexOptions.length > 1) {
      for (
        let regexOptionIndex = 0;
        regexOptionIndex < regexOptions.length;
        ++regexOptionIndex
      ) {
        const regexParts = this.sliceRegexByThen(
          regexOptions[regexOptionIndex]
        );
        const regexPartsStarts = regexParts[0];
        const regexPartsRemainders = regexParts[1];
        // for each option, test if the first part of the regex matches
        // if it doesn't, continue
        // if it does, keep checking until what part it matches
        if (!new RegExp(regexPartsStarts[0]).test(beginning)) {
          // if there are no more options
          if (regexOptionIndex === regexOptions.length - 1) {
            // we return the first option, but we could return any option

            // TODO: RETURN ANY TEXT THAT MATCHES regexOptions[0]
            return regexOptions[0];
          }
        } else {
          for (
            let regexPartIndex = 1;
            regexPartIndex < regexPartsStarts.length;
            ++regexPartIndex
          ) {
            if (!new RegExp(regexPartsStarts[regexPartIndex]).test(beginning)) {
              // TODO: RETURN ANY TEXT THAT MATCHES regexPartsRemainders[regexPartIndex - 1]
              return regexPartsRemainders[regexPartIndex - 1];
            }
          }
        }
      }
    } else if (regexOptions.length === 1) {
      const regexParts = this.sliceRegexByThen(regexOptions[0]);
      const regexPartsStarts = regexParts[0];
      const regexPartsRemainders = regexParts[1];
      if (!new RegExp(regexPartsStarts[0]).test(beginning)) {
        // TODO: RETURN ANY TEXT THAT MATCHES regularExpressionString
        return regularExpressionString;
      } else {
        for (
          let regexPartIndex = 1;
          regexPartIndex < regexPartsStarts.length;
          ++regexPartIndex
        ) {
          if (!new RegExp(regexPartsStarts[regexPartIndex]).test(beginning)) {
            // TODO: RETURN ANY TEXT THAT MATCHES regexPartsRemainders[regexPartIndex - 1]
            return regexPartsRemainders[regexPartIndex - 1];
          }
        }
      }
    }
    // TODO: RETURN AN EMPTY STRING
    return 'NO DEBERÍA SER POSIBLE';
  }
}
