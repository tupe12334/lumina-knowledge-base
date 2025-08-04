import { QuestionSeedData } from './questions.seed';
import { QuestionType, QuestionValidationStatus } from '../../generated/client';

const YES_TRANSLATION_ID = 'c1d6bbad-b174-4f06-8dbd-89aaac420be5';
const NO_TRANSLATION_ID = '5ad96b46-8670-4368-858b-453472383bd2';

/**
 * How to formalize a question and answers
 * A. remove ":" from the end of the question text
 * B. remove "?" from the end of the question or answer text
 * C. Remove "." from the end of the question or answer text
 *
 */
export const QUESTIONS: QuestionSeedData[] = [
  {
    id: '82715303-8361-47ef-930e-6979947b741e',
    translationId: '58503f66-af42-4992-bdc1-79fc62c4a61f',
    text: {
      en_text:
        'How to formalize the statement: "The square of every real number different from zero is greater than zero"',
      he_text:
        'איך לפרמל את הפסוק: "הריבוע של כל מספר ממשי ששונה מאפס הוא גדול מאפס"',
    },
    type: QuestionType.selection,
    moduleId: 'a56fb4f6-cd1f-42e2-83ce-16dafaf2f067',
    answers: [
      {
        id: '7765796d-aea0-4158-8108-9a8f3b468761',
        selectAnswers: [
          {
            id: '3b1ab701-ddbf-4964-8b89-b094a4f39c74',
            translationId: '7ac8c2ed-1b4f-4e7a-9d5e-8f3b2c4a1e6d',
            text: {
              en_text: '∀x ∈ ℝ, x ≠ 0 → x² > 0',
              he_text: '∀x ∈ ℝ, x ≠ 0 → x² > 0',
            },
            isCorrect: true,
          },
          {
            id: '86d3b1f2-edad-426d-bc3d-ed8a00cb5e6f',
            translationId: '9e2f4a1c-3d5e-4b7f-8a9d-1c2e3f4a5b6c',
            text: {
              en_text: '∃x ∈ ℝ, x ≠ 0 ∧ x² > 0',
              he_text: '∃x ∈ ℝ, x ≠ 0 ∧ x² > 0',
            },
            isCorrect: false,
          },
          {
            id: 'dfb0bdcc-b665-4346-9c3e-4c8363abfa82',
            translationId: '1f3e5a7c-4b6d-4e8f-9a1c-2d3e4f5a6b7c',
            text: {
              en_text: '∀x ∈ ℝ, x² > 0 → x ≠ 0',
              he_text: '∀x ∈ ℝ, x² > 0 → x ≠ 0',
            },
            isCorrect: false,
          },
          {
            id: '8de87d54-8cca-406b-9efd-cae3316f54ca',
            translationId: '2a4c6e8f-5b7d-4f9a-8c1e-3d4e5f6a7b8c',
            text: {
              en_text: '∀x ∈ ℝ, x ≠ 0 ∧ x² > 0',
              he_text: '∀x ∈ ℝ, x ≠ 0 ∧ x² > 0',
            },
            isCorrect: false,
          },
          {
            id: '7b4f58ce-80ba-4afa-85f3-aa2d3afb2afe',
            translationId: '3b5d7f9a-6c8e-4a1c-9d2e-4e5f6a7b8c9d',
            text: {
              en_text: '∃x ∈ ℝ, x ≠ 0 → x² > 0',
              he_text: '∃x ∈ ℝ, x ≠ 0 → x² > 0',
            },
            isCorrect: false,
          },
          {
            id: 'b30305ba-f9d5-4ae7-a857-c5332167dbbb',
            translationId: '4c6e8a1c-7d9f-4b2d-8e1f-5f6a7b8c9d1e',
            text: {
              en_text: '∀x ∈ ℝ, x² > 0 ∧ x ≠ 0',
              he_text: '∀x ∈ ℝ, x² > 0 ∧ x ≠ 0',
            },
            isCorrect: false,
          },
          {
            id: '2c9fa43e-8251-4e91-9282-906f6e42f89b',
            translationId: '5d7f9b2e-8e1a-4c3e-9f2a-6a7b8c9d1e2f',
            text: {
              en_text: '∀x ∈ ℝ, x = 0 → x² > 0',
              he_text: '∀x ∈ ℝ, x = 0 → x² > 0',
            },
            isCorrect: false,
          },
          {
            id: '66e32bf3-c76c-4d37-aea2-15b473e42df5',
            translationId: '6e8a1c3f-9f2b-4d4f-8a3b-7b8c9d1e2f3a',
            text: {
              en_text: '∃x ∈ ℝ, x² > 0 ∧ x ≠ 0',
              he_text: '∃x ∈ ℝ, x² > 0 ∧ x ≠ 0',
            },
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: '4772edba-f192-4364-9abc-715040763696',
    translationId: 'd39c0ad3-92d1-4290-b604-0033444b6f03',
    text: {
      en_text:
        'About a real number x, the statement "The square of any real number that is not zero is positive" can be expressed as',
      he_text:
        'על מספר ממשי x, הפסוק "הריבוע של כל מספר ממשי שאינו אפס הוא חיובי" יכול להיות מבוטא כ',
    },
    type: QuestionType.selection,
    moduleId: 'a56fb4f6-cd1f-42e2-83ce-16dafaf2f067',
    answers: [
      {
        id: 'A1A-2024-EXAM-LOGIC-FORMALIZATION',
        selectAnswers: [
          {
            id: 'OPT1-Q1A-2024-EXAM-LOGIC-FORMALIZATION',
            translationId: '8f9a1b2c-4d5e-4f6a-9b8c-7d8e9f1a2b3c',
            text: {
              en_text: '∀x((x ≠ 0) ∧ (x² > 0))',
              he_text: '∀x((x ≠ 0) ∧ (x² > 0))',
            },
            isCorrect: false,
          },
          {
            id: 'OPT2-Q1A-2024-EXAM-LOGIC-FORMALIZATION',
            translationId: '9a1c2d3e-5f6a-4b7c-8d9e-8e9f1a2b3c4d',
            text: {
              en_text: '∀x((x² ≤ 0) → (x = 0))',
              he_text: '∀x((x² ≤ 0) → (x = 0))',
            },
            isCorrect: true,
          },
          {
            id: 'OPT3-Q1A-2024-EXAM-LOGIC-FORMALIZATION',
            translationId: '1b2d3f4a-6c7e-4d8f-9a1b-9f1a2b3c4d5e',
            text: {
              en_text: '∀x((x > 0) ∨ (x < 0) ∨ (x² > 0))',
              he_text: '∀x((x > 0) ∨ (x < 0) ∨ (x² > 0))',
            },
            isCorrect: false,
          },
          {
            id: 'OPT4-Q1A-2024-EXAM-LOGIC-FORMALIZATION',
            translationId: '338bee00-49e8-47f1-afd7-ab19015bdf2a',
            text: {
              en_text: 'All previous statements are equivalent',
              he_text: 'כל ההצהרות הקודמות שוות',
            },
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'c597d294-577d-4612-92d5-70d5a2bfed75',
    translationId: 'b0500946-9885-4afa-b80d-72969aefbe82',
    text: {
      en_text:
        'In this question open intervals refer to (a,b) meaning a < b. Given an infinite and bounded set A of real numbers',
      he_text:
        'בשאלה זו רווחים פתוחים מתייחסים ל-(a,b) כלומר a < b. בהינתן קבוצה אינסופית וחסומה A של מספרים ממשיים',
    },
    type: QuestionType.selection,
    moduleId: '6e19169a-959d-4f5d-a475-de09ca9ba8cd',
    answers: [
      {
        id: 'A1B-2024-EXAM-SET-THEORY',
        selectAnswers: [
          {
            id: 'OPT1-Q1B-2024-EXAM-SET-THEORY',
            translationId: 'd18996b8-4006-460d-a20c-720e7f830eb1',
            text: {
              en_text:
                'There exists a small open interval (a,b) such that A ∩ (a,b) = ℵ₀',
              he_text: 'קיים רווח פתוח קטן (a,b) כך ש A ∩ (a,b) = ℵ₀',
            },
            isCorrect: false,
          },
          {
            id: 'OPT2-Q1B-2024-EXAM-SET-THEORY',
            translationId: '85854db4-bde9-4adf-b574-20fb84bd9d8e',
            text: {
              en_text:
                'There exists a small open interval (a,b) such that A ∩ (a,b) ≠ ℵ₀',
              he_text: 'קיים רווח פתוח קטן (a,b) כך ש A ∩ (a,b) ≠ ℵ₀',
            },
            isCorrect: true,
          },
          {
            id: 'OPT3-Q1B-2024-EXAM-SET-THEORY',
            translationId: 'ed575596-a4f8-4dad-a044-1cd48d755c80',
            text: {
              en_text:
                'There exists a small open interval (a,b) such that (ℝ \\ A) ∩ (a,b) = ℵ₀',
              he_text: 'קיים רווח פתוח קטן (a,b) כך ש (ℝ \\ A) ∩ (a,b) = ℵ₀',
            },
            isCorrect: false,
          },
          {
            id: 'OPT4-Q1B-2024-EXAM-SET-THEORY',
            translationId: '338bee00-49e8-47f1-afd7-ab19015bdf2a',
            text: {
              en_text: 'All previous statements are equivalent',
              he_text: 'כל ההצהרות הקודמות שוות',
            },
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: '574963f1-9917-4dff-9e61-a67004190c66',
    translationId: 'ec50e39c-ef19-4e91-8f5a-7ed39f14f334',
    text: {
      en_text: 'If G is a directed graph with 6 vertices, then',
      he_text: 'אם G הוא גרף מכוון עם 6 קודקודים, אז',
    },
    type: QuestionType.selection,
    moduleId: '8f4e9a3b-2c1d-4f5e-9a8b-7c3d6e5f8a9b',
    answers: [
      {
        id: 'A1C-2024-EXAM-GRAPH-THEORY',
        selectAnswers: [
          {
            id: 'OPT1-Q1C-2024-EXAM-GRAPH-THEORY',
            translationId: 'e625868b-df75-4b35-ba75-50c73a5759ef',
            text: {
              en_text: 'G is not planar',
              he_text: 'G אינו מישורי',
            },
            isCorrect: false,
          },
          {
            id: 'OPT2-Q1C-2024-EXAM-GRAPH-THEORY',
            translationId: '8e8e35ce-8ff5-442d-803f-c3086f0abc74',
            text: {
              en_text: 'G is not Hamiltonian',
              he_text: 'G אינו המילטוני',
            },
            isCorrect: false,
          },
          {
            id: 'OPT3-Q1C-2024-EXAM-GRAPH-THEORY',
            translationId: '9d1f2c3d-5e6f-4a7b-8c9d-8b9c1d2e3f4a',
            text: {
              en_text: 'Either G is planar or G is Eulerian',
              he_text: 'או ש-G מישורי או ש-G אוילריאני',
            },
            isCorrect: true,
          },
          {
            id: 'OPT4-Q1C-2024-EXAM-GRAPH-THEORY',
            translationId: '338bee00-49e8-47f1-afd7-ab19015bdf2a',
            text: {
              en_text: 'All previous statements are equivalent',
              he_text: 'כל ההצהרות הקודמות שוות',
            },
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: '6a8b4690-6daf-44f4-b58d-23ff1ff8d51d',
    translationId: 'd5f0c74e-7fa6-442d-9339-635eafd81a40',
    text: {
      en_text:
        'The question involves sequences denoted by aₙ with letters A, B, C, D, E where:\n- A and also B must contain exactly one letter from C or D\n- For example: C,D,E,AC,BC,BDAA are valid, but AB,AEC,ABC,BDCAC are not valid\nThe question has multiple parts worth 7, 7, and 13 points',
      he_text:
        'השאלה כוללת רצפות המסומנות בaₙ עם אותיות A, B, C, D, E כאשר:\n- A וגם B חייבים להכיל בדיוק אות אחת מ-C או D\n- לדוגמה: C,D,E,AC,BC,BDAA תקפות, אך AB,AEC,ABC,BDCAC אינן תקפות\nהשאלה כוללת מספר חלקים בשווי 7, 7, ו-13 נקודות',
    },
    type: QuestionType.void,
    moduleId: '2b8d7f9c-3a4e-4b5f-8c9d-1e2f3a4b5c6d',
    answers: [
      {
        id: 'A4-2024-EXAM-SEQUENCES-LETTERS',
      },
    ],
  },
  {
    id: '31d7aac7-1e5d-42c1-bcf8-f08fc0858fc9',
    translationId: 'ca3b16e0-f0f9-4fc3-b9d8-e14590eb2d8e',
    text: {
      en_text:
        'Given a vertex set V = {1,2,3,4,5,6,7,8} and edge series (6,7,8,1,1,1), where G is the simple graph obtained by adding edges between pairs of vertices in T (and possibly other edges)',
      he_text:
        'בהינתן קבוצת קודקודים V = {1,2,3,4,5,6,7,8} וסדרת קשתות (6,7,8,1,1,1), כאשר G הוא הגרף הפשוט המתקבל על ידי הוספת קשתות בין זוגות קודקודים ב-T (ואולי קשתות אחרות)',
    },
    type: QuestionType.void,
    moduleId: '8f4e9a3b-2c1d-4f5e-9a8b-7c3d6e5f8a9b',
    parts: [
      {
        id: 'A5-PART1-2024-EXAM-GRAPH-ANALYSIS',
        order: 1,
        partQuestion: {
          id: 'be6ec990-7712-4661-8834-db370180553f',
          translationId: 'c0b633ef-31cd-4ebf-b389-61970605931e',
          text: {
            en_text: 'Whether G is an Euler graph',
            he_text: 'האם G הוא גרף אוילריאני',
          },
          type: QuestionType.selection,
          moduleId: '8f4e9a3b-2c1d-4f5e-9a8b-7c3d6e5f8a9b',
          answers: [
            {
              id: 'A5-PART1-ANSWER-2024-EXAM-GRAPH-ANALYSIS',
              selectAnswers: [
                {
                  id: 'A5-PART1-YES-2024-EXAM-GRAPH-ANALYSIS',
                  translationId: YES_TRANSLATION_ID,
                  text: {
                    en_text: 'Yes',
                    he_text: 'כן',
                  },
                  isCorrect: true,
                },
                {
                  id: 'A5-PART1-NO-2024-EXAM-GRAPH-ANALYSIS',
                  translationId: NO_TRANSLATION_ID,
                  text: {
                    en_text: 'No',
                    he_text: 'לא',
                  },
                  isCorrect: false,
                },
              ],
            },
          ],
        },
      },
      {
        id: 'A5-PART2-2024-EXAM-GRAPH-ANALYSIS',
        order: 2,
        partQuestion: {
          id: '31d7aac7-1e5d-42c1-bcf8-f08fc0858fc9',
          translationId: 'ca3b16e0-f0f9-4fc3-b9d8-e14590eb2d8e',
          text: {
            en_text: 'Whether G is not a bipartite graph',
            he_text: 'האם G אינו גרף דו-חלקי',
          },
          type: QuestionType.selection,
          moduleId: '8f4e9a3b-2c1d-4f5e-9a8b-7c3d6e5f8a9b',
          answers: [
            {
              id: 'A5-PART2-ANSWER-2024-EXAM-GRAPH-ANALYSIS',
              selectAnswers: [
                {
                  id: 'A5-PART2-YES-2024-EXAM-GRAPH-ANALYSIS',
                  translationId: YES_TRANSLATION_ID,
                  text: {
                    en_text: 'Yes',
                    he_text: 'כן',
                  },
                  isCorrect: false,
                },
                {
                  id: 'A5-PART2-NO-2024-EXAM-GRAPH-ANALYSIS',
                  translationId: NO_TRANSLATION_ID,
                  text: {
                    en_text: 'No',
                    he_text: 'לא',
                  },
                  isCorrect: true,
                },
              ],
            },
          ],
        },
      },
      {
        id: 'A5-PART3-2024-EXAM-GRAPH-ANALYSIS',
        order: 3,
        partQuestion: {
          id: 'c9b96835-2bf2-4116-ace1-1f7e058dab4d',
          translationId: '49b5c46b-89cf-4e3a-888d-df23b817f557',
          text: {
            en_text: 'Finding the number of vertices of G (with explanation)',
            he_text: 'מציאת מספר הקודקודים של G (עם הסבר)',
          },
          type: QuestionType.void,
          moduleId: '8f4e9a3b-2c1d-4f5e-9a8b-7c3d6e5f8a9b',
          answers: [
            {
              id: 'A5-PART3-ANSWER-2024-EXAM-GRAPH-ANALYSIS',
            },
          ],
        },
      },
    ],
    answers: [
      {
        id: 'A5-2024-EXAM-GRAPH-ANALYSIS',
      },
    ],
  },
  {
    id: '91c2fd31-eb88-4804-ad59-8415a3044955',
    translationId: 'ba098000-4b8e-488c-bafb-0416198ab5ca',
    text: {
      en_text:
        'Distribute 4 balls of type A, 4 balls of type B, 4 balls of type C, and 4 balls of type D into 4 different cells. (Balls of the same type are considered identical).',
      he_text:
        'מפזרים 4 כדורים מסוג A, 4 כדורים מסוג B, 4 כדורים מסוג C ו־4 כדורים מסוג D ב־4 תאים שונים. (כדורים מאותו סוג נחשבים זהים).',
    },
    type: QuestionType.void,
    moduleId: '2b8d7f9c-3a4e-4b5f-8c9d-1e2f3a4b5c6d',
    parts: [
      {
        id: '78ccd73c-5b22-4d2e-9950-c026e0a02bdc',
        order: 1,
        partQuestion: {
          id: '75397d4b-9e65-4d97-a31f-4db89a56c64f',
          translationId: '00703a76-5fca-4f2f-82b2-5afd86fd0283',
          text: {
            en_text: 'Calculate the number of all possible distributions.',
            he_text: 'חשבו את מספר כל הפיזורים האפשריים.',
          },
          type: QuestionType.value,
          moduleId: '2b8d7f9c-3a4e-4b5f-8c9d-1e2f3a4b5c6d',
          answers: [
            {
              id: 'a73521cc-1565-4d86-8719-c26456aaeb9d',
              numberAnswer: {
                id: '7711ec4b-750b-4a0c-a28c-2a2d5f161e4a',
                value: 1500625,
              },
            },
          ],
        },
      },
      {
        id: '2642c752-22da-49ee-901b-33d6bc739b9e',
        order: 2,
        partQuestion: {
          id: '4c98a837-8f70-4c66-85b0-079eb780c57d',
          translationId: '57975cc8-efa9-4174-ac5e-fd003913c63d',
          text: {
            en_text:
              'Calculate the number of distributions where no cell contains balls of all types.',
            he_text:
              'חשבו את מספר הפיזורים שבהם אין תא המכיל כדורים מכל הסוגים.',
          },
          type: QuestionType.value,
          moduleId: '2b8d7f9c-3a4e-4b5f-8c9d-1e2f3a4b5c6d',
          answers: [
            {
              id: '71ab66ac-28a2-4a66-a331-5131519ef454',
              numberAnswer: {
                id: 'ad39d2ef-8ba8-41b2-b19d-dcd4a24d2a59',
                value: 919602,
              },
            },
          ],
        },
      },
    ],
    answers: [
      {
        id: '265e9af7-a374-409d-8def-cc777787b296',
      },
    ],
  },
  {
    id: 'c1533f9b-bf48-401f-9055-496e6cf1e7ff',
    translationId: '7750cecd-29cb-4eb1-b513-328284bf9866',
    text: {
      en_text:
        'A menu offers 3 appetizers and 4 desserts. How many choices are available if you may choose one item from either category?',
      he_text:
        'במסעדה מוצעים 3 מתאבנים ו־4 קינוחים. כמה אפשרויות בחירה יש אם ניתן לבחור פריט אחד מאחת הקטגוריות?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.approved,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'ce178537-7265-4713-ab70-ae7e2a2f57b3',
        numberAnswer: {
          id: '252e9f47-f4bc-41d5-a874-833382d06df2',
          value: 7,
        },
      },
    ],
  },
  {
    id: 'ae430c5c-32e2-4cd5-9b0b-155d8256cfbf',
    translationId: 'b0faab8f-eb6b-4cb2-ad14-30254ef179fc',
    text: {
      en_text:
        'A bookstore sells 5 fiction and 7 non-fiction titles. How many choices are there if you select one book from either category?',
      he_text:
        'חנות ספרים מוכרת 5 ספרי סיפורת ו-7 ספרי עיון. כמה אפשרויות יש אם בוחרים ספר אחד מאחת הקטגוריות?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'c833f84e-dc56-4ab0-8a59-5bfd378b7c6c',
        numberAnswer: {
          id: '303f021b-9c38-4d1b-b496-c737a1c2d7b1',
          value: 12,
        },
      },
    ],
  },
  {
    id: '9d3da146-016e-4583-bc89-3aa8f113fedc',
    translationId: 'cdeaf3e0-d9db-44c7-9aad-0d974e6ea546',
    text: {
      en_text:
        'A clothing store offers 4 shirts and 6 pants. How many items can you choose from if selecting either a shirt or pants?',
      he_text:
        'חנות בגדים מציעה 4 חולצות ו-6 מכנסיים. כמה פריטים ניתן לבחור אם בוחרים חולצה או מכנסיים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'e24ab3be-ceb1-436a-969c-d59eddeb12a0',
        numberAnswer: {
          id: '4bef0219-c99e-43c0-a6cf-aa3ec5506274',
          value: 10,
        },
      },
    ],
  },
  {
    id: '3d352abc-6d69-4f7b-9708-d015fabe3426',
    translationId: '65b9fa9f-8a10-4a5a-9400-6f910708ced2',
    text: {
      en_text:
        'A library has 8 English magazines and 5 Hebrew magazines. How many magazines could you borrow if choosing one language?',
      he_text:
        'בספרייה יש 8 מגזינים באנגלית ו-5 בעברית. כמה מגזינים ניתן להשאיל אם בוחרים בשפה אחת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: '91831553-056d-4d17-8bce-194394ea898a',
        numberAnswer: {
          id: '5b8edfd8-9ea2-415b-b684-43875dbb45ee',
          value: 13,
        },
      },
    ],
  },
  {
    id: 'fe111498-245b-458d-b7f0-6ba74eaf4f93',
    translationId: '96f33cd2-c9a5-4c60-8ffe-0d21c4fa04c4',
    text: {
      en_text:
        'A cafe menu lists 6 hot drinks and 3 cold drinks. How many options exist if you pick one drink of any temperature?',
      he_text:
        'בתפריט בית הקפה יש 6 משקאות חמים ו-3 משקאות קרים. כמה אפשרויות יש אם ניתן לבחור משקה אחד מאחת הקטגוריות?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: '8b2b575c-201a-42d1-8621-5f9ae45f7ddc',
        numberAnswer: {
          id: 'c1950214-af73-494a-a630-0395dc44f0e1',
          value: 9,
        },
      },
    ],
  },
  {
    id: '35abb4b5-e856-4905-bbd0-24f94025ca75',
    translationId: '602fdc46-93dd-416e-bb3c-fc8badd26251',
    text: {
      en_text:
        'A university offers 5 morning classes and 4 evening classes. How many classes can a student choose from if limited to one time slot?',
      he_text:
        'אוניברסיטה מציעה 5 שיעורי בוקר ו-4 שיעורי ערב. כמה שיעורים ניתן לבחור אם מוגבלים למועד אחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'af7417a4-5c63-4c25-bd17-292b08ac529e',
        numberAnswer: {
          id: '68103994-172c-40a9-aa6f-72f8917a7f67',
          value: 9,
        },
      },
    ],
  },
  {
    id: '668b8fa6-da30-4859-89ba-15404f0c634e',
    translationId: '5201f907-d004-4932-98a3-3ecd2ef71ad9',
    text: {
      en_text:
        'A tech conference has 7 workshops on day one and 5 workshops on day two. How many workshops can you attend if you attend only one day?',
      he_text:
        'בכנס טכנולוגיה יש 7 סדנאות ביום הראשון ו-5 ביום השני. כמה סדנאות ניתן להשתתף אם מגיעים ליום אחד בלבד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'b673ed54-1c24-4a29-a2b9-cdcc88d504c5',
        numberAnswer: {
          id: 'ab9cec1f-a673-4ed3-ab48-ee309a1e1acc',
          value: 12,
        },
      },
    ],
  },
  {
    id: '4eb7f037-d3cc-4553-b1f2-04f79c8485f2',
    translationId: '28ac3388-d73e-414e-83d9-d92aa9d82a61',
    text: {
      en_text:
        'A theater shows 3 comedies and 5 dramas. How many films could you watch if you choose from either genre?',
      he_text:
        'תיאטרון מקרין 3 קומדיות ו-5 דרמות. כמה סרטים ניתן לצפות אם בוחרים מז׳אנר אחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: '6e66e7cc-d8ef-4fb8-af25-8635cd5301e6',
        numberAnswer: {
          id: 'f6de0bfa-c6f3-46e2-9037-faf535991f21',
          value: 8,
        },
      },
    ],
  },
  {
    id: '0b72f452-1826-4414-a1e0-3bcb83e5dbc8',
    translationId: '275e3588-98b0-424a-b6f3-ef2958150009',
    text: {
      en_text:
        'A travel agency has 4 domestic packages and 6 international packages. How many packages are available if you choose only one?',
      he_text:
        'סוכנות נסיעות מציעה 4 חבילות בארץ ו-6 חבילות לחו״ל. כמה חבילות זמינות אם בוחרים רק אחת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'c69fee9d-a3b3-450c-a384-d3d723f24db6',
        numberAnswer: {
          id: '84331a19-ccd3-49e9-8f23-4368e4827f59',
          value: 10,
        },
      },
    ],
  },
  {
    id: '3351a0f5-c051-4f85-a93d-c83bcbdfbe20',
    translationId: '65165ce6-c6cd-438e-8660-dcf2105f9c59',
    text: {
      en_text:
        'A sports club offers 5 indoor activities and 4 outdoor activities. How many activities can you select if participating in only one?',
      he_text:
        'מועדון ספורט מציע 5 פעילויות בתוך מבנה ו-4 פעילויות חוץ. כמה פעילויות ניתן לבחור אם משתתפים רק באחת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: '2d9f28e8-7f1c-4f1d-ae0d-ce1904f512a7',
        numberAnswer: {
          id: '1f582281-68cb-40bb-8836-b1320e3e9132',
          value: 9,
        },
      },
    ],
  },
  {
    id: '5d986983-6188-4616-a220-78c15c724a72',
    translationId: '1a4f5e63-7e43-4ee6-b07a-be5c15cd7366',
    text: {
      en_text:
        'A music festival features 6 rock bands and 2 jazz bands. How many bands can a fan watch if they pick a single genre?',
      he_text:
        'פסטיבל מוזיקה מציג 6 להקות רוק ו-2 להקות ג׳אז. כמה להקות ניתן לראות אם בוחרים ז׳אנר אחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'fd6f60cb-c267-4da1-82f5-ff2935b6c063',
        numberAnswer: {
          id: '2b1c2e9f-b3ab-4f28-b7b5-de3b8aca4e44',
          value: 8,
        },
      },
    ],
  },
  {
    id: 'a84e1e98-161e-4215-a3ab-296720e6fa12',
    translationId: '23122bf9-a9b8-413e-a332-892d419017c4',
    text: {
      en_text:
        'A grocery store sells 7 kinds of fruit and 4 kinds of vegetables. How many choices are there if buying one item from either group?',
      he_text:
        'חנות מכולת מוכרת 7 סוגי פירות ו-4 סוגי ירקות. כמה אפשרויות יש אם קונים פריט אחד מאחת הקבוצות?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: '5ca02096-a94f-4961-9a29-21504db8b67f',
        numberAnswer: {
          id: '76519284-a8d3-410a-86d9-42ea74e350a5',
          value: 11,
        },
      },
    ],
  },
  {
    id: '8bb9fcb0-c90a-430e-a5f5-9df0c92b9f3a',
    translationId: '2b6cba5a-27dc-4e02-8e90-7a3ca6490515',
    text: {
      en_text:
        'A museum offers 2 guided tours in English and 3 in Spanish. How many tours could a visitor take if choosing one language?',
      he_text:
        'מוזיאון מציע 2 סיורים מודרכים באנגלית ו-3 בספרדית. כמה סיורים יכול מבקר לקחת אם הוא בוחר שפה אחת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'e1dd2d8c-503c-478d-b87c-060b6d5dab83',
        numberAnswer: {
          id: '88ecc074-c15d-4deb-9cfe-328b23d3d250',
          value: 5,
        },
      },
    ],
  },
  {
    id: '4931fa06-ee0e-4bcb-8e9d-5869294d6ae3',
    translationId: 'efc49f76-65ac-4f41-8329-17b055ff654f',
    text: {
      en_text:
        'A park has 5 picnic areas and 3 playgrounds. How many locations can a family choose if visiting just one?',
      he_text:
        'בפארק יש 5 אזורי פיקניק ו-3 מגרשי משחקים. כמה מקומות יכולה משפחה לבחור אם מבקרת רק באחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: '81ca5465-4f20-4076-a466-7fe68cffb5a6',
        numberAnswer: {
          id: '9ebb2d41-b302-415a-8c44-3ab00b44db01',
          value: 8,
        },
      },
    ],
  },
  {
    id: 'bb119d9c-4363-4fb4-b18f-8b673fe2e9cf',
    translationId: 'e68b7607-efea-4b4c-a677-4a63db960f7a',
    text: {
      en_text:
        'An online course platform has 4 math courses and 5 science courses. How many courses can a student enroll in if choosing one subject?',
      he_text:
        'בפלטפורמת קורסים מקוונת יש 4 קורסי מתמטיקה ו-5 קורסי מדע. כמה קורסים יכול סטודנט להירשם אם בוחר מקצוע אחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: '4136ad83-d76f-41fb-8504-e1a4cf00e5e5',
        numberAnswer: {
          id: 'e3fee53a-557e-4028-b977-d33fa62bb331',
          value: 9,
        },
      },
    ],
  },
  {
    id: '51210ae1-d445-4a43-b98a-d084f8a64a1b',
    translationId: 'e6690c2e-0fc7-404d-a71d-d77845910b54',
    text: {
      en_text:
        'A bookstore sells 6 hardcover and 3 paperback journals. How many journals can be selected if choosing either type?',
      he_text:
        'חנות ספרים מוכרת 6 יומנים בכריכה קשה ו-3 בכריכה רכה. כמה יומנים ניתן לבחור אם בוחרים סוג אחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'b656d13e-fdce-4d48-b4fc-dbff10c64735',
        numberAnswer: {
          id: 'b64a6f25-f996-40bd-9f1a-259b98127598',
          value: 9,
        },
      },
    ],
  },
  {
    id: '24879301-1e9c-4148-8ca6-f8a68ba8b245',
    translationId: '30da94db-17de-4218-b041-f4caf651f7be',
    text: {
      en_text:
        'A gym schedules 3 morning and 4 evening yoga classes. How many classes are available if attending only one session?',
      he_text:
        'חדר כושר מקיים 3 שיעורי יוגה בבוקר ו-4 בערב. כמה שיעורים זמינים אם משתתפים רק באחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'c8e2c069-1c26-424c-9fcf-62ec55de6866',
        numberAnswer: {
          id: '26577f54-238a-4ccd-8fc6-2473cd0aea65',
          value: 7,
        },
      },
    ],
  },
  {
    id: '0daa3b86-2ac2-42f6-9a40-a8be67345094',
    translationId: '0dec8af3-f8d6-4e8b-ba1e-a7059b78174e',
    text: {
      en_text:
        'A pet shop has 5 breeds of dogs and 2 breeds of cats. How many animal choices are available if adopting one pet?',
      he_text:
        'חנות חיות מחזיקה 5 גזעי כלבים ו-2 גזעי חתולים. כמה אפשרויות חיות זמינות אם מאמצים חיה אחת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'f88ddc14-2ba6-4273-b789-3e966943c908',
        numberAnswer: {
          id: '04496fee-c54e-4879-9381-21fdf8ff1678',
          value: 7,
        },
      },
    ],
  },
  {
    id: 'a1033614-522f-475f-9ca5-c59625f875df',
    translationId: 'fa2a7e90-3615-498c-8d8f-e958ffde4c51',
    text: {
      en_text:
        'A science fair displays 4 physics projects and 5 chemistry projects. How many projects can a visitor view if focusing on one subject?',
      he_text:
        'ביריד מדע מוצגים 4 פרויקטים בפיזיקה ו-5 בכימיה. כמה פרויקטים יכול מבקר לראות אם מתמקד בנושא אחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: 'efc43465-2936-4dce-a5f4-ba4b13fc4abe',
        numberAnswer: {
          id: '3c57adbe-4f3f-429a-9a51-8feb27dc2e93',
          value: 9,
        },
      },
    ],
  },
  {
    id: '465f3938-6beb-40cd-9fa2-6be426439bf6',
    translationId: '6b8fcbdf-b0a2-42eb-a9b1-161f7f92f7ac',
    text: {
      en_text:
        'A store offers 6 types of lamps and 4 types of chairs. How many items can a customer choose from if buying just one?',
      he_text:
        'חנות מציעה 6 סוגי מנורות ו-4 סוגי כיסאות. כמה פריטים יכול לקוח לבחור אם קונה רק אחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: '00c0234c-328f-492b-bdb1-6572a5dfa44f',
        numberAnswer: {
          id: 'b4099679-9aeb-447f-a80f-03cfc28f4ca5',
          value: 10,
        },
      },
    ],
  },
  {
    id: 'e3dadd54-cb2d-4856-8f04-988afcff2212',
    translationId: '1f8f28f2-7d5d-4598-a447-930ef4c2147b',
    text: {
      en_text:
        'A restaurant provides 3 vegan dishes and 6 non-vegan dishes. How many meal options exist if ordering a single dish?',
      he_text:
        'מסעדה מציעה 3 מנות טבעוניות ו-6 מנות שאינן טבעוניות. כמה אפשרויות ארוחה קיימות אם מזמינים מנה אחת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '78123942-6F56-4C66-8881-B49BC26E107D',
    answers: [
      {
        id: '79959a55-6ee3-431f-bf42-de64d822dd0b',
        numberAnswer: {
          id: '9e314539-d0ae-4342-86db-43c3cb5e050b',
          value: 9,
        },
      },
    ],
  },
  {
    id: '4603f4bc-8fb5-42a8-8ebc-672085f10104',
    translationId: 'b81240ad-ed98-4a7e-9dea-7e922e884d19',
    text: {
      en_text:
        'A coffee shop sells 3 types of coffee and 4 types of pastry. How many different combinations of one coffee and one pastry can you order?',
      he_text:
        'בית קפה מוכר 3 סוגי קפה ו־4 סוגי מאפה. כמה שילובים שונים של קפה ומאפה ניתן להזמין?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.approved,
    moduleId: '81BE3915-2C63-470E-85FE-55C1062DEFF3',
    answers: [
      {
        id: '0119d10c-89a2-4f4a-90c2-f64dbde97558',
        numberAnswer: {
          id: 'db91b513-9e85-4a0e-852c-6827ab6dc877',
          value: 12,
        },
      },
    ],
  },
  {
    id: '3b84d950-8d79-4dd2-92f5-3e231ba870ef',
    translationId: 'f4e15a03-0822-47ca-ab99-522416a28365',
    text: {
      en_text:
        'Let A and B be finite sets with |A| = 3 and |B| = 4. How many elements does A × B contain?',
      he_text:
        'נניח A ו־B הן קבוצות סופיות שמספר איבריהן הוא |A| = 3 ו־|B| = 4. כמה איברים מכילה המכפלה הקרטזית A × B?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.approved,
    moduleId: '81BE3915-2C63-470E-85FE-55C1062DEFF3',
    answers: [
      {
        id: '1e7deeb9-e88c-4c91-a95c-79536c6be7cd',
        numberAnswer: {
          id: 'bd264741-e9f4-4e92-847d-8a6ee7ea8ed0',
          value: 12,
        },
      },
    ],
  },
  {
    id: 'D0920552-1AFA-493D-9019-4FFDBE079A32',
    translationId: 'E07E39B7-1EDE-4F5F-B988-01D92FED7BE3',
    text: {
      en_text:
        "How many permutations are there of the letters in the word 'APPLE'?",
      he_text: "כמה תמורות יש לאותיות במילה 'APPLE'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.approved,
    moduleId: '2b8d7f9c-3a4e-4b5f-8c9d-1e2f3a4b5c6d',
    answers: [
      {
        id: 'D0920552-1AFA-493D-9019-4FFDBE079A32-answer',
        numberAnswer: {
          id: 'D0920552-1AFA-493D-9019-4FFDBE079A32-number-answer',
          value: 60,
        },
      },
    ],
  },
  {
    id: '9C030140-9A43-46ED-9B57-9E7A17ABEB41',
    translationId: 'F2EA2E63-3376-4CB8-85EA-4F70DE1603AB',
    text: {
      en_text:
        "In how many distinct ways can the letters of the word 'MISSISSIPPI' be arranged?",
      he_text: "בכמה דרכים שונות ניתן לסדר את האותיות במילה 'MISSISSIPPI'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.approved,
    moduleId: '2b8d7f9c-3a4e-4b5f-8c9d-1e2f3a4b5c6d',
    answers: [
      {
        id: '9C030140-9A43-46ED-9B57-9E7A17ABEB41-answer',
        numberAnswer: {
          id: '9C030140-9A43-46ED-9B57-9E7A17ABEB41-number-answer',
          value: 34650,
        },
      },
    ],
  },
  {
    id: 'ec882e46-05be-4b12-9715-514963a7fdc1',
    translationId: '894bc578-2725-4d23-bf16-b57ccf3b0a80',
    text: {
      en_text:
        'How many ways can you choose 3 students from a class of 10 students?',
      he_text: 'בכמה דרכים ניתן לבחור 3 תלמידים מתוך כיתה של 10 תלמידים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.approved,
    moduleId: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    answers: [
      {
        id: 'ec73a468-679d-4997-a29e-99cf84d98e7a',
        numberAnswer: {
          id: '2846288c-849a-48f1-84f6-cfdd641a143c',
          value: 120,
        },
      },
    ],
  },
  {
    id: '7eeac0c9-70da-41c9-81c5-8d7d021d35de',
    translationId: '87bf2c16-3e44-4a93-b2c4-abead40c51f5',
    text: {
      en_text:
        'How many ways can you choose 5 cards from a standard deck such that exactly 3 are hearts?',
      he_text:
        'בכמה דרכים ניתן לבחור 5 קלפים מחבילת קלפים רגילה כך שבדיוק 3 מתוכם יהיו לבבות?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '9c8e5d2a-4b7f-4c8d-9e0a-1b2c3d4e5f6a',
    answers: [
      {
        id: '1821e0aa-3ee5-4b41-8084-876b59401015',
        numberAnswer: {
          id: '5e190214-b2d2-45bf-b2d8-d0ebc451a80b',
          value: 211926,
        },
      },
    ],
  },
  {
    id: 'c3ee52fe-d3aa-4766-b37a-e27db485e155',
    translationId: '5f9313d3-6258-4fe1-87f6-21a39af92d29',
    text: {
      en_text:
        'From a group of 7 men and 5 women, how many committees of 4 can be formed that contain at least 2 women?',
      he_text:
        'מתוך קבוצה של 7 גברים ו־5 נשים, כמה ועדות של 4 אפשר להרכיב שבהן יש לפחות 2 נשים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '9c8e5d2a-4b7f-4c8d-9e0a-1b2c3d4e5f6a',
    answers: [
      {
        id: 'f35b76ba-4d11-4978-868c-854c1a3c521d',
        numberAnswer: {
          id: 'ce79c2bd-dfeb-4c6f-9c5e-9c2f56d72835',
          value: 285,
        },
      },
    ],
  },
  {
    id: 'd16b0597-0099-4399-b68e-e383e7ce9c2b',
    translationId: '21885747-9432-4370-8901-0e0cf137297c',
    text: {
      en_text:
        'How many ways can 8 identical balls be distributed into 4 distinct boxes if each box must contain at least one ball?',
      he_text:
        'בכמה דרכים ניתן לחלק 8 כדורים זהים ל־4 תיבות שונות כך שבכל תיבה יהיה לפחות כדור אחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '9c8e5d2a-4b7f-4c8d-9e0a-1b2c3d4e5f6a',
    answers: [
      {
        id: '8b528449-52c3-4714-9748-6fc6a7903d44',
        numberAnswer: {
          id: '427c74b8-1687-44d5-8887-ee57da5a0353',
          value: 35,
        },
      },
    ],
  },
  {
    id: 'afde050e-2e6a-498d-9f60-41a0a4d6ad1e',
    translationId: 'f39a03e3-8807-462b-bb79-0a8f5d3afbc7',
    text: {
      en_text:
        'How many non‐negative integer solutions are there to x₁ + x₂ + x₃ + x₄ = 15 if each xᵢ is at most 6?',
      he_text:
        'כמה פתרונות במספרים שלמים אי‐שליליים קיימים למשוואה x₁ + x₂ + x₃ + x₄ = 15 כאשר כל xᵢ אינו עולה על 6?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '9c8e5d2a-4b7f-4c8d-9e0a-1b2c3d4e5f6a',
    answers: [
      {
        id: '3b3f073f-1d7f-4dc8-a68e-420466cb4dec',
        numberAnswer: {
          id: '43e640b6-8d6b-4daf-a2c7-66f7b322aebc',
          value: 180,
        },
      },
    ],
  },
  {
    id: 'aaf10b9d-c077-4be0-9664-ddc362690beb',
    translationId: '1631553c-3065-403d-a3aa-8e11f02c2120',
    text: {
      en_text:
        'How many ways can you select 4 donuts from 6 types if repetitions are allowed?',
      he_text:
        'בכמה דרכים ניתן לבחור 4 דונאטס מתוך 6 סוגים אם מותר לבחור אותו סוג יותר מפעם אחת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '14582bd6-a7df-459f-a649-5624968656df',
        numberAnswer: {
          id: '26103a24-18b1-41bc-953b-849519041681',
          value: 126,
        },
      },
    ],
  },
  {
    id: '2836a9da-1042-40ab-a686-44300695758a',
    translationId: 'fb76aff9-70f7-42ef-9bc7-08bb69cf85e4',
    text: {
      en_text:
        'How many non-negative integer solutions exist for x₁ + x₂ + x₃ = 7?',
      he_text:
        'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ = 7?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '8d06d736-5684-4fc9-892f-98ec2735c4af',
        numberAnswer: {
          id: '6fdfdfb8-6b19-4961-849b-a649fd880361',
          value: 36,
        },
      },
    ],
  },
  {
    id: '8e73ca25-dac6-4055-b775-8604bcf07a61',
    translationId: 'fcd1ca85-90f7-49ec-99ff-24f8cd89ec49',
    text: {
      en_text:
        'How many ways can you choose 5 fruits from apples, bananas, oranges and pears if repetitions are allowed?',
      he_text:
        'בכמה דרכים ניתן לבחור 5 פירות מתוך תפוחים, בננות, תפוזים ואגסים כאשר מותר בחירה חוזרת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '9799cdce-08a0-45a4-9ddc-63a2d3490948',
        numberAnswer: {
          id: '0023be1e-933f-4dc6-b133-2e60e3ac0205',
          value: 56,
        },
      },
    ],
  },
  {
    id: '64cbc8a7-9e95-4999-a73d-628713b527ef',
    translationId: 'd79898d6-6f3e-4611-ae25-41a96c2f706e',
    text: {
      en_text:
        'In how many ways can 10 identical candies be distributed among 3 children?',
      he_text: 'בכמה דרכים ניתן לחלק 10 ממתקים זהים בין 3 ילדים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '6d82762c-ed83-4127-a85c-1b7c2c322322',
        numberAnswer: {
          id: 'c0e1eae3-fdfd-4279-b7bf-2fe5c7c3f015',
          value: 66,
        },
      },
    ],
  },
  {
    id: '588b6f9c-ae27-47f9-a8e4-678145f2bc38',
    translationId: 'c0ce7106-b885-4996-b313-55ab834c2dfe',
    text: {
      en_text:
        'How many ways can you select 8 ice cream scoops from 5 flavors if flavors may repeat?',
      he_text:
        'בכמה דרכים ניתן לבחור 8 כדורי גלידה מתוך 5 טעמים אם ניתן לבחור טעם יותר מפעם אחת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: 'eb5c8ad1-775a-45b1-a90e-fb8d2f137c45',
        numberAnswer: {
          id: 'b868198f-846a-4341-b673-376793437adc',
          value: 495,
        },
      },
    ],
  },
  {
    id: 'b63dc0f8-0951-44dd-93ca-e3cb1dbd63d0',
    translationId: '6d7e2c23-ba10-41e4-81bd-b4d586ef924e',
    text: {
      en_text:
        'How many non-negative integer solutions exist for x₁ + x₂ + x₃ + x₄ = 6?',
      he_text:
        'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ + x₄ = 6?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '7efcc177-115f-4a5e-be93-f7e6c79979f8',
        numberAnswer: {
          id: '71860e5b-514b-4674-9af6-78eea49762b2',
          value: 84,
        },
      },
    ],
  },
  {
    id: 'd0bb0263-5ec1-48d1-85db-dd6eea02067d',
    translationId: '962e9824-2aad-41eb-93f7-356629f205a3',
    text: {
      en_text:
        'In how many ways can 15 identical balls be placed into 5 distinct boxes?',
      he_text: 'בכמה דרכים ניתן לשים 15 כדורים זהים ב־5 תיבות שונות?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '3030c72e-817d-4f60-9873-dadeeddc587c',
        numberAnswer: {
          id: '8fe8289d-5e10-4928-80f1-c612eaae8aec',
          value: 3876,
        },
      },
    ],
  },
  {
    id: '748f47e6-26ba-4b71-b63a-c0a87dafb3ca',
    translationId: '62f1128e-aa5b-440c-b989-5c8e21cc5c7a',
    text: {
      en_text:
        'How many ways can you choose 7 cupcakes from 3 flavors if flavors may repeat?',
      he_text:
        'בכמה דרכים ניתן לבחור 7 קאפקייקס מתוך 3 טעמים כאשר מותר בחירה חוזרת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: 'c2d10d3d-f3e0-4a99-80dc-248a3d70b1af',
        numberAnswer: {
          id: '6b39dde2-ff1f-4d0f-b688-58cdfbac250b',
          value: 36,
        },
      },
    ],
  },
  {
    id: 'c9a57967-1c17-4b2c-a88d-474ab59469c1',
    translationId: 'a65d4ab9-cf19-449c-8aac-8086634bd4f2',
    text: {
      en_text:
        'How many ways can you choose 6 candies from 4 types if repetitions are allowed?',
      he_text:
        'בכמה דרכים ניתן לבחור 6 ממתקים מתוך 4 סוגים אם מותר לבחור אותו סוג יותר מפעם אחת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: 'ce096208-793b-42bc-95a7-e1cd7a594264',
        numberAnswer: {
          id: '959f34b8-74c2-4fc2-a3fe-eee49cfd1e64',
          value: 84,
        },
      },
    ],
  },
  {
    id: '64889a17-54fb-4edd-b6eb-cf4edd807e3f',
    translationId: '23087717-eaed-4612-b5ee-43e88794c30d',
    text: {
      en_text:
        'How many non-negative integer solutions exist for x₁ + x₂ + x₃ = 12?',
      he_text:
        'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ = 12?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: 'd0e88715-7ad1-48cc-a364-c5c6543dbeb6',
        numberAnswer: {
          id: 'c348eebd-558c-421f-806e-25f041965bc2',
          value: 91,
        },
      },
    ],
  },
  {
    id: '21c54a9d-c5ad-4d06-8d07-c89acce469cb',
    translationId: 'd8f724e9-9e1f-4656-ad77-4ade25848835',
    text: {
      en_text:
        'How many non-negative integer solutions exist for x₁ + x₂ + x₃ + x₄ = 9?',
      he_text:
        'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ + x₄ = 9?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '588a8d02-206d-4e5b-b3ea-5a54b6334bd7',
        numberAnswer: {
          id: '5636c8c8-abcf-4227-a10f-8e00d02a3d59',
          value: 220,
        },
      },
    ],
  },
  {
    id: 'd554a693-d532-42c2-bff3-ad79462494f5',
    translationId: '3f1cb82d-592e-4df9-a2bf-fcccdec55a6f',
    text: {
      en_text:
        'How many ways can you choose 5 coins from 8 types if repetitions are allowed?',
      he_text:
        'בכמה דרכים ניתן לבחור 5 מטבעות מתוך 8 סוגים כאשר מותר בחירה חוזרת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '0f5f68e6-6b1d-4c12-aa5f-cb5043536f5c',
        numberAnswer: {
          id: '79dcf2ca-f99e-4a40-9746-bf20a5ac1063',
          value: 792,
        },
      },
    ],
  },
  {
    id: '76b2afaa-629e-4379-8e01-0575e74a72b0',
    translationId: '48508123-6f76-4945-aa1c-1412d894f809',
    text: {
      en_text:
        'In how many ways can 7 identical marbles be distributed into 2 boxes?',
      he_text: 'בכמה דרכים ניתן לחלק 7 גולות זהות לשתי תיבות?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '69cff16d-b025-4d29-8f8c-1c34fb94b548',
        numberAnswer: {
          id: 'ead70531-a200-4b6c-877a-9b9e989c0082',
          value: 8,
        },
      },
    ],
  },
  {
    id: '2ca6fd38-6d9f-41b1-8823-6a36cff5de7e',
    translationId: 'c1c272c4-b2af-46fd-b5f8-8b291193c02b',
    text: {
      en_text:
        'How many ways can you select 3 ice cream scoops from 10 flavors if flavors may repeat?',
      he_text:
        'בכמה דרכים ניתן לבחור 3 כדורי גלידה מתוך 10 טעמים כאשר מותר בחירה חוזרת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '5bee3bb4-cfbb-46fb-b4bd-542db9e1de43',
        numberAnswer: {
          id: 'ad053f03-d46c-40c6-ab0e-af6892656f64',
          value: 220,
        },
      },
    ],
  },
  {
    id: '55366ebc-51d1-412a-b0a4-33cab00f8c5a',
    translationId: '9bba34bf-e461-44be-b76f-f398155a3911',
    text: {
      en_text:
        'How many non-negative integer solutions exist for x₁ + x₂ + x₃ + x₄ + x₅ = 8?',
      he_text:
        'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ + x₄ + x₅ = 8?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '3c7e424a-9185-4771-8fa2-284cb6c3ded9',
        numberAnswer: {
          id: 'a23f38bb-2223-4e9d-8dcf-a76fba2f0d17',
          value: 495,
        },
      },
    ],
  },
  {
    id: '604ff1b4-1b80-485f-a7a1-be1b1fb43dc2',
    translationId: '9fe79279-2cc8-4531-b892-2c5a4daebb23',
    text: {
      en_text:
        'How many ways can you choose 9 songs from 5 genres if genres may repeat?',
      he_text:
        'בכמה דרכים ניתן לבחור 9 שירים מתוך 5 סגנונות אם ניתן לבחור אותו סגנון יותר מפעם אחת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '6bfca521-f0f3-4094-b9a3-afbda91d152c',
        numberAnswer: {
          id: 'beb2776c-5193-4104-b454-ccd3d831fdfd',
          value: 715,
        },
      },
    ],
  },
  {
    id: '5f6fe70f-7417-4f0c-86b6-5703dc3b9fa7',
    translationId: '23979268-a195-4e17-b8bf-3b071c664206',
    text: {
      en_text:
        'In how many ways can 11 identical pencils be distributed among 4 students?',
      he_text: 'בכמה דרכים ניתן לחלק 11 עפרונות זהים בין 4 תלמידים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '6dfe77fa-388f-4749-a491-20068369df09',
        numberAnswer: {
          id: '874fcede-b45d-49df-a51b-e51a0f5f813c',
          value: 364,
        },
      },
    ],
  },
  {
    id: 'a69f2e8c-0a35-4a51-8ba3-f74890ea0b64',
    translationId: '913e8191-9320-4b00-8087-c77b84d16012',
    text: {
      en_text:
        'How many ways can you choose 4 letters from 7 distinct letters if repetitions are allowed?',
      he_text:
        'בכמה דרכים ניתן לבחור 4 אותיות מתוך 7 אותיות שונות כאשר מותר בחירה חוזרת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: 'fee9014e-d481-4681-a241-ebf6862048bc',
        numberAnswer: {
          id: '67e88df2-785f-47e8-affa-596909fe3899',
          value: 210,
        },
      },
    ],
  },
  {
    id: 'f7f54fbc-c140-4fb0-9654-11b39c406563',
    translationId: '32d50646-3dde-4762-961b-d1d1b15a4c1a',
    text: {
      en_text:
        'How many non-negative integer solutions exist for x₁ + x₂ + x₃ + x₄ + x₅ + x₆ = 5?',
      he_text:
        'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ + x₄ + x₅ + x₆ = 5?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: 'f0b1cd24-bf6c-4f21-bcf0-98ca7a52946b',
        numberAnswer: {
          id: '62030862-cafd-4112-b9bb-1adc5c796f93',
          value: 252,
        },
      },
    ],
  },
  {
    id: '20771ee6-aafe-433b-b153-03b474b67aa3',
    translationId: '190e3057-0c8f-4d44-a387-b216e8632ede',
    text: {
      en_text:
        'How many ways can you choose 2 items from 6 types with repetition allowed?',
      he_text:
        'בכמה דרכים ניתן לבחור 2 פריטים מתוך 6 סוגים כאשר מותר בחירה חוזרת?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '87a1da94-793c-4565-8706-8fd073a50cf6',
    answers: [
      {
        id: '45a02cea-ea88-43e2-bdba-06f62f115540',
        numberAnswer: {
          id: '20283b7c-12ca-4eb1-9113-8fd90cf70357',
          value: 21,
        },
      },
    ],
  },
  {
    id: '0CB337D9-F5CA-43B4-8945-531CF4C57BC2',
    translationId: 'D9B273B8-4F71-4C1D-994F-DDA7292001BD',
    text: {
      en_text: `How many distinct permutations can be made from the letters of the word 'MATHEMATICS'?`,
      he_text: `כמה תמורות שונות ניתן ליצור מהאותיות במילה 'MATHEMATICS'?`,
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '2b8d7f9c-3a4e-4b5f-8c9d-1e2f3a4b5c6d',
    answers: [
      {
        id: 'EDFB5B2E-FAAC-4FC3-BBA3-8D8A73800F76',
        numberAnswer: {
          id: '98D136B1-7B0D-4D2C-BAA8-B83755B3A4C1',
          value: 4989600,
        },
      },
    ],
  },
  {
    id: '7928652E-847C-4685-8618-2449068369B2',
    translationId: 'B96A706B-3C1F-43BA-8B1D-BBE44B70E81C',
    text: {
      en_text:
        'In how many ways can 5 boys and 5 girls be seated in a row so that no two girls sit together?',
      he_text:
        'בכמה דרכים ניתן להושיב 5 בנים ו-5 בנות בשורה כך שאף שתי בנות לא תשבנה יחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '2b8d7f9c-3a4e-4b5f-8c9d-1e2f3a4b5c6d',
    answers: [
      {
        id: '3C95C523-997F-4BC3-A9A4-684E26ED4971',
        numberAnswer: {
          id: '8102C2FF-FFE6-4B9B-A4E0-F39CDE5DEA27',
          value: 86400,
        },
      },
    ],
  },
  {
    id: 'f235ed49-ae6d-4202-8d1a-e5592106f7b0',
    translationId: 'd4d867eb-48cc-45f6-970a-e8d54bdb39e9',
    text: {
      en_text: 'How many ways can 5 distinct objects be arranged in a row?',
      he_text: 'כמה אפשרויות לסדר 5 עצמים שונים בשורה?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    answers: [
      {
        id: '2b55f123-42dd-463f-bea6-ce8cd8ef8e1a',
        numberAnswer: {
          id: '5d20b3f7-bf99-4eb7-a2f6-f1129899a1c7',
          value: 120,
        },
      },
    ],
  },
  {
    id: 'b6be29ea-7790-4e42-aac1-12a00e493d1e',
    translationId: 'eaaa76b5-0c41-44e0-8d6f-c2f03b7fe196',
    text: {
      en_text:
        "How many permutations of the letters in the word 'LEVEL' are possible?",
      he_text: "כמה תמורות אפשריות לאותיות במילה 'LEVEL'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    answers: [
      {
        id: 'fe41abf2-52cc-4a47-b980-95f3030a2828',
        numberAnswer: {
          id: '6e37cf99-96da-4389-9c94-0f50034ee019',
          value: 30,
        },
      },
    ],
  },
  {
    id: '2e19beed-16e7-4e45-8a00-749755150309',
    translationId: 'ff8255b9-c2a5-4b6f-95fe-7d1b98fe4aa8',
    text: {
      en_text:
        'How many 3-letter arrangements can be formed from A, B, C, D without repetition?',
      he_text: 'כמה סידורים בני 3 אותיות ניתן ליצור מהאותיות A,B,C,D ללא חזרה?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    answers: [
      {
        id: '20dca280-c077-441d-bf80-374f315fb58b',
        numberAnswer: {
          id: 'f4937a9f-c88f-41f0-bfdd-0ffd7db1e4e0',
          value: 24,
        },
      },
    ],
  },
  {
    id: '6fc66261-2ece-4828-b7df-abb9f70a9c13',
    translationId: 'e272682c-6a21-4761-9309-72fad15c33b3',
    text: {
      en_text: 'How many ways can 4 books be arranged on a shelf?',
      he_text: 'כמה דרכים קיימות לסדר 4 ספרים על מדף?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    answers: [
      {
        id: '57574d74-b8b6-4444-a371-c2d69f5fcf11',
        numberAnswer: {
          id: 'a309d254-958e-4e1b-a1a3-392adbe80e7f',
          value: 24,
        },
      },
    ],
  },
  {
    id: 'ee3a4ec3-c930-41b5-bd2d-453632eed46f',
    translationId: '9e876f30-59e2-4b8e-81ab-5186dc4d1211',
    text: {
      en_text:
        'In how many distinct ways can 5 people sit around a circular table?',
      he_text: 'בכמה דרכים שונות יכולים 5 אנשים לשבת סביב שולחן עגול?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    answers: [
      {
        id: '9fe9b757-ae38-49e7-b98a-140046cae94d',
        numberAnswer: {
          id: '625dd07f-23d2-4e9e-9f1b-7702e2abc5a5',
          value: 24,
        },
      },
    ],
  },
  {
    id: '76b376fd-00ef-4ac8-b271-5adae1b87ffa',
    translationId: '1b406d77-ef11-4bdd-bf00-86171c667d7c',
    text: {
      en_text:
        'How many 4-digit even numbers can be formed using digits 1,2,3,4 without repetition?',
      he_text:
        'כמה מספרים זוגיים בני 4 ספרות ניתן להרכיב מהספרות 1,2,3,4 ללא חזרות?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    answers: [
      {
        id: 'bf9f8c99-7c6f-4ed8-a37b-6d118840e2c1',
        numberAnswer: {
          id: 'fb36ad47-b1e7-47bb-ae24-658211820b0e',
          value: 12,
        },
      },
    ],
  },
  {
    id: '696df248-43cf-4d31-a04c-21d5bc526201',
    translationId: '07e38cca-7219-46ee-b9c0-ff5f56afd1d6',
    text: {
      en_text: "How many permutations are there of the word 'BANANA'?",
      he_text: "כמה תמורות יש למילה 'BANANA'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    answers: [
      {
        id: '4bee6579-07eb-4b61-85c2-8674aad6ba34',
        numberAnswer: {
          id: '2c0c5c23-8a47-4961-8ed8-71899bd7ce1a',
          value: 60,
        },
      },
    ],
  },
  {
    id: '1812c17a-631d-412c-9b53-0bbe8616865b',
    translationId: '8498d647-63b4-4ad0-8a57-1439605f3def',
    text: {
      en_text:
        'In how many ways can 8 runners finish a race if ties are not allowed?',
      he_text: 'בכמה אופנים יכולים 8 רצים לסיים מרוץ ללא תיקו?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    answers: [
      {
        id: 'b14dc768-484c-4d63-89b4-dec271f81456',
        numberAnswer: {
          id: 'cb16e541-89e3-4cdc-9583-1a9497df48c0',
          value: 40320,
        },
      },
    ],
  },
  {
    id: '731ff527-0bb4-449a-8bb0-8054a7ce4ff7',
    translationId: 'dde375a5-44af-433d-be3c-1c0a8aeb6570',
    text: {
      en_text:
        'How many 5-digit numbers greater than 30000 can be formed using digits 1-5 without repetition?',
      he_text:
        'כמה מספרים בני 5 ספרות הגדולים מ-30000 ניתן ליצור מהספרות 1-5 ללא חזרות?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    answers: [
      {
        id: '9e4d3ade-b3ac-4ec6-bacf-6f8a73643b7c',
        numberAnswer: {
          id: 'eac03a1f-15a6-4c16-9451-5dacc7b9ba34',
          value: 72,
        },
      },
    ],
  },
  {
    id: '4e5c702f-1653-4273-9e0b-6d0d0f371123',
    translationId: 'ab92366c-e66f-457a-9619-62439a063060',
    text: {
      en_text:
        "How many distinct permutations can be made from the letters of the word 'STATISTICS'?",
      he_text: "כמה תמורות שונות אפשר ליצור מהאותיות במילה 'STATISTICS'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    answers: [
      {
        id: '98185bd2-5482-490b-a99f-8685e093f182',
        numberAnswer: {
          id: 'b199ee7b-bb1d-484b-8829-4b1f3ae1cccd',
          value: 50400,
        },
      },
    ],
  },
  {
    id: 'd6ec730d-e089-4bf7-a78c-51938e5abb1f',
    translationId: '39ecb7d6-6f0c-4321-ad6b-1c1ef18b3821',
    text: {
      en_text: 'How many permutations does a set of 2 elements have?',
      he_text: 'כמה תמורות יש לקבוצה בת 2 איברים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: 'fe7ac410-4860-4e22-adcc-a172b7a821a6',
        numberAnswer: {
          id: '750891b3-b13f-4412-b9a0-25089a77a209',
          value: 2,
        },
      },
    ],
  },
  {
    id: '79f0217e-1e3b-48e2-ad81-647b48fe65b4',
    translationId: 'ece19f63-2445-42f6-b4c4-a78251d29ac8',
    text: {
      en_text: 'How many permutations does a set of 3 elements have?',
      he_text: 'כמה תמורות יש לקבוצה בת 3 איברים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: 'd3df96a8-0047-48d0-a258-490eeec98cff',
        numberAnswer: {
          id: '652ab9c3-9563-41e6-babb-91b3e89c6efb',
          value: 6,
        },
      },
    ],
  },
  {
    id: 'c7e0573d-8af7-4e08-b43c-80e691c1a26f',
    translationId: 'c8499c0e-d5d6-44be-9e05-c6e43478248d',
    text: {
      en_text: 'How many permutations does a set of 4 elements have?',
      he_text: 'כמה תמורות יש לקבוצה בת 4 איברים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: 'b2e20c98-c203-4234-a8b0-492c043ea03a',
        numberAnswer: {
          id: '2cc5b6b8-bfa1-4c2a-8f21-4839080f9e5b',
          value: 24,
        },
      },
    ],
  },
  {
    id: '00b88ebb-c6d5-4c84-bd37-35eeb6c8e87b',
    translationId: 'eb6142df-3a75-4961-9ab9-3364fb1b41d2',
    text: {
      en_text: 'How many permutations does a set of 5 elements have?',
      he_text: 'כמה תמורות יש לקבוצה בת 5 איברים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: 'c9411e8c-1133-4f0c-994c-a0677579c61f',
        numberAnswer: {
          id: '197bf824-e2d9-4f62-9c50-22512f4b1342',
          value: 120,
        },
      },
    ],
  },
  {
    id: '327b9258-b0bf-4ad8-839d-e148be734c1b',
    translationId: '266f382e-7372-4ada-b9d5-1164f7cd1484',
    text: {
      en_text: 'How many permutations does a set of 6 elements have?',
      he_text: 'כמה תמורות יש לקבוצה בת 6 איברים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '7d822bd0-1094-40ec-ad22-7f4cecb81186',
        numberAnswer: {
          id: '3bd0a7e7-5fca-4511-b117-759a2e229a09',
          value: 720,
        },
      },
    ],
  },
  {
    id: '14df0e0f-61a8-4944-b6ec-f86b6ceb2895',
    translationId: '0fe128ef-3e35-43b8-8a07-e5f4dc59afb6',
    text: {
      en_text: 'How many permutations does a set of 7 elements have?',
      he_text: 'כמה תמורות יש לקבוצה בת 7 איברים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '46236d07-deb4-4d59-ad78-14e19c9b7630',
        numberAnswer: {
          id: '960d5efd-4359-429c-9666-e5f87b993b75',
          value: 5040,
        },
      },
    ],
  },
  {
    id: '2ea0d0f6-72ee-40c1-bee6-0e108e00518b',
    translationId: 'd7f2ae10-ab6c-4b87-975f-72862d855d8b',
    text: {
      en_text: 'How many permutations does a set of 8 elements have?',
      he_text: 'כמה תמורות יש לקבוצה בת 8 איברים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '56990433-af03-4849-92b8-2c8661d86859',
        numberAnswer: {
          id: '6a0b48c3-690c-4607-961f-988ce3928b6a',
          value: 40320,
        },
      },
    ],
  },
  {
    id: '3f76b61a-06a7-4cc5-aeee-3a746e296e7c',
    translationId: 'aecd18e8-c1c9-4d34-98da-acb7c6facca4',
    text: {
      en_text: 'How many permutations does a set of 9 elements have?',
      he_text: 'כמה תמורות יש לקבוצה בת 9 איברים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: 'bc4c5224-2599-42f4-9fae-34ac817eee24',
        numberAnswer: {
          id: 'fa4f3196-c247-4813-a3b5-6a3a040638f4',
          value: 362880,
        },
      },
    ],
  },
  {
    id: 'd8f15c35-4501-4319-b023-9299b2f5d657',
    translationId: 'ba37ff74-f80f-4d59-9eb9-f0d9be22afae',
    text: {
      en_text: 'How many permutations does a set of 10 elements have?',
      he_text: 'כמה תמורות יש לקבוצה בת 10 איברים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: 'a608c05a-a6c1-489d-8274-010ab5cfd950',
        numberAnswer: {
          id: 'f3dc5563-858b-4e68-b119-a61fba6b49c3',
          value: 3628800,
        },
      },
    ],
  },
  {
    id: '211aaec2-0f7e-4284-a9b8-10d6f2a3f5d7',
    translationId: '29c284c4-b029-4f69-9d98-a5387233276b',
    text: {
      en_text: 'How many permutations does a set of 11 elements have?',
      he_text: 'כמה תמורות יש לקבוצה בת 11 איברים?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '93b5fcff-e6ec-4153-a482-38d39122daad',
        numberAnswer: {
          id: 'b44ae229-2535-4682-87d0-aa5aa815777a',
          value: 39916800,
        },
      },
    ],
  },
  {
    id: 'aa9e8157-b9cd-4c0a-b4bc-b38a1dd8711a',
    translationId: '67bcd62c-95ae-4463-a2b3-5393b9138648',
    text: {
      en_text: "How many permutations of the word 'BOOK' are there?",
      he_text: "כמה תמורות יש למילה 'BOOK'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: 'bcbacc9f-a431-439b-8b4a-6c64ca698e4e',
        numberAnswer: {
          id: '7eeb22b9-4ec5-4341-acf2-6b937d850eaf',
          value: 12,
        },
      },
    ],
  },
  {
    id: '8814afbc-ed5c-4aab-9ef5-8f7c144666ad',
    translationId: 'fdfc9517-93a2-4fc7-8493-433f8fcf88aa',
    text: {
      en_text: "How many permutations of the word 'BALLOON' are there?",
      he_text: "כמה תמורות יש למילה 'BALLOON'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '8c3c4d01-ae8c-4648-b4f9-a19dc13f0f54',
        numberAnswer: {
          id: '03fd6002-f614-4d62-a8c1-6020a734f983',
          value: 1260,
        },
      },
    ],
  },
  {
    id: '55c37922-cb30-478b-b34d-a1a11b187694',
    translationId: '99a82160-6d62-4f1d-b4d6-b1f10a6e1fde',
    text: {
      en_text: "How many permutations of the word 'LETTER' are there?",
      he_text: "כמה תמורות יש למילה 'LETTER'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '6c5f5979-659e-477a-aa86-f4c1a00b80bf',
        numberAnswer: {
          id: 'c0b79885-a81b-40ae-a890-c699ad79e608',
          value: 180,
        },
      },
    ],
  },
  {
    id: '82995866-568b-4a32-a54e-843d4a86b1ad',
    translationId: 'b923289d-32d6-4317-8d69-92f86383da91',
    text: {
      en_text: "How many permutations of the word 'SUCCESS' are there?",
      he_text: "כמה תמורות יש למילה 'SUCCESS'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '6360d3fb-9b1d-4869-8181-49df330ad520',
        numberAnswer: {
          id: '0ffed6c3-18d9-42de-b078-3ca4cbc884b6',
          value: 420,
        },
      },
    ],
  },
  {
    id: '9668db04-68b7-4986-986a-2691006566fe',
    translationId: '3fcb84fd-e40e-45b7-bc00-03aba624fd61',
    text: {
      en_text: "How many permutations of the word 'TATTOO' are there?",
      he_text: "כמה תמורות יש למילה 'TATTOO'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '5739463f-c2b0-492f-8eaf-2578260807e7',
        numberAnswer: {
          id: '896f521d-2255-4ee7-a273-e85c19fec37b',
          value: 60,
        },
      },
    ],
  },
  {
    id: 'd9930c32-6a64-4229-abb2-9fc24a1b2d46',
    translationId: '6a05e03c-53c0-4f48-8e59-2485823a5bae',
    text: {
      en_text: "How many permutations of the word 'PROGRAM' are there?",
      he_text: "כמה תמורות יש למילה 'PROGRAM'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: 'f304ab74-083b-44f3-adb6-65b2b5e8f346',
        numberAnswer: {
          id: '3389d613-1718-4690-ab25-fe759968c1f5',
          value: 2520,
        },
      },
    ],
  },
  {
    id: '4ee821ad-d40f-443a-a0fb-5226393ad622',
    translationId: '9815dc92-b767-44a7-8267-a16aba509e68',
    text: {
      en_text: "How many permutations of the word 'BALANCE' are there?",
      he_text: "כמה תמורות יש למילה 'BALANCE'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '6cd49e9f-d177-4cc2-bfb4-32175142b061',
        numberAnswer: {
          id: '94b06170-3fa0-493d-8628-5351de7afb19',
          value: 2520,
        },
      },
    ],
  },
  {
    id: 'd76a3f96-d6b8-4c71-b4e1-dd5c0e28193a',
    translationId: 'b2bc472c-b20e-45c7-a552-48ec8dc8234e',
    text: {
      en_text: "How many permutations of the word 'INDEPENDENT' are there?",
      he_text: "כמה תמורות יש למילה 'INDEPENDENT'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '551c05be-9925-4921-9170-90c6f8b3ce91',
        numberAnswer: {
          id: '0cf94b6e-bb65-4c1e-b9d6-121ab335ba92',
          value: 554400,
        },
      },
    ],
  },
  {
    id: '6ca9db44-2c32-42b4-a52e-8a109ed6cc6b',
    translationId: 'a603c448-5491-4803-aa47-df00430b9526',
    text: {
      en_text: "How many permutations of the word 'MISSILE' are there?",
      he_text: "כמה תמורות יש למילה 'MISSILE'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '64376439-6aef-454b-82ea-511b82662959',
        numberAnswer: {
          id: 'ee6bcedf-0e7f-4544-ad01-08234dd5efc2',
          value: 1260,
        },
      },
    ],
  },
  {
    id: 'ef4f87dd-0f82-4ed5-9231-60a95b80978c',
    translationId: 'eeb787d9-7a15-47d5-8725-367aeabc47ea',
    text: {
      en_text: "How many permutations of the word 'PEPPER' are there?",
      he_text: "כמה תמורות יש למילה 'PEPPER'?",
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    answers: [
      {
        id: '471c2400-20db-4d7e-ab32-ab95a81d5be3',
        numberAnswer: {
          id: '16787136-4a63-4ac1-a39a-f02bbd6512d2',
          value: 60,
        },
      },
    ],
  },
  {
    id: 'ddd90146-abb2-44a4-83c7-e2ca0194ede8',
    translationId: 'f0822445-f9c1-452d-8c3c-6de61098177b',
    text: {
      en_text: 'Is zero an even number',
      he_text: 'האם אפס הוא מספר זוגי',
    },
    type: QuestionType.selection,
    moduleId: 'a56fb4f6-cd1f-42e2-83ce-16dafaf2f067',
    answers: [
      {
        id: 'b3715e89-9cdd-42db-8053-19d65c8d92a8',
        selectAnswers: [
          {
            id: 'bacac835-0059-457a-aec9-dc8795f1d0ec',
            translationId: YES_TRANSLATION_ID,
            text: { en_text: 'Yes', he_text: 'כן' },
            isCorrect: true,
          },
          {
            id: 'c1414657-15c8-4f05-8584-e6c07907a162',
            translationId: NO_TRANSLATION_ID,
            text: { en_text: 'No', he_text: 'לא' },
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: '8d08ab89-2e8f-4d5d-8a1d-9283e84f2973',
    translationId: '3774b231-66e2-42b5-964b-a7ca3cffd565',
    text: {
      en_text: 'What is the square root of 144',
      he_text: 'מהו השורש הריבועי של 144',
    },
    type: QuestionType.value,
    moduleId: '6e19169a-959d-4f5d-a475-de09ca9ba8cd',
    answers: [
      {
        id: 'f0c73e13-7562-437c-8e1d-4c4c61fed8b2',
        numberAnswer: {
          id: 'e01906b1-305c-44cb-b452-bc71fd0c4568',
          value: 12,
        },
      },
    ],
  },
  {
    id: '0cca7095-d2b5-402c-8895-c028c791c3b3',
    translationId: '627d6bc0-5764-4b99-bdca-abdbacd5a82c',
    text: {
      en_text: 'Describe your favorite study technique',
      he_text: 'תאר את שיטת הלמידה המועדפת עליך',
    },
    type: QuestionType.void,
    moduleId: '2b8d7f9c-3a4e-4b5f-8c9d-1e2f3a4b5c6d',
    answers: [
      {
        id: '1e85ae4e-78d9-406a-8d09-e93e56252aa5',
      },
    ],
  },
  {
    id: 'adc25314-48a4-4fb9-8849-45120c8e5b24',
    translationId: '3eed2bf4-2068-4492-b0a1-d6230df46d99',
    text: {
      en_text: 'How many integers from 1 to 100 are divisible by 2 or 5?',
      he_text: 'כמה מספרים שלמים בין 1 ל-100 מתחלקים ב-2 או ב-5?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '4f5a6b7c-8d9e-4012-a456-789abc123def',
    answers: [
      {
        id: 'dff6c604-8cdc-446c-85a5-711bfe40682d',
        numberAnswer: {
          id: '54aca958-6ec4-4fde-9845-8639a72e0e22',
          value: 60,
        },
      },
    ],
  },
  {
    id: '8c9fbf32-317c-48de-a1d0-3409ad149a3c',
    translationId: '67cb3992-ad01-4a69-9738-1eacf9bd0985',
    text: {
      en_text: 'How many integers from 1 to 100 are divisible by 3 or 7?',
      he_text: 'כמה מספרים שלמים בין 1 ל-100 מתחלקים ב-3 או ב-7?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '4f5a6b7c-8d9e-4012-a456-789abc123def',
    answers: [
      {
        id: '58b77e86-14d7-4233-972d-4ea4a262bab4',
        numberAnswer: {
          id: '83427450-9939-424e-9c89-aa08df4d8d56',
          value: 43,
        },
      },
    ],
  },
  {
    id: 'e527edaf-afba-4686-9837-5d43bb4899bc',
    translationId: '5f85faa1-6351-413d-805b-4791490e802c',
    text: {
      en_text: 'How many integers from 1 to 200 are divisible by 3 or 5 or 7?',
      he_text: 'כמה מספרים שלמים בין 1 ל-200 מתחלקים ב-3 או ב-5 או ב-7?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '4f5a6b7c-8d9e-4012-a456-789abc123def',
    answers: [
      {
        id: '422da29f-8f7e-4fc6-9b73-9b39ffccd49e',
        numberAnswer: {
          id: '43732a0d-6195-44ca-af4e-d4d8bd297f07',
          value: 108,
        },
      },
    ],
  },
  {
    id: '05736047-d0a1-44b5-ab41-1ea5c554a109',
    translationId: 'e5bcbc7d-dbc1-4e25-aff7-742ad9c64cb2',
    text: {
      en_text:
        '40 study math 50 physics 60 computer science 20 study math and physics 25 math and computer science 30 physics and computer science and 5 study all three How many students study at least one subject?',
      he_text:
        '40 לומדים מתמטיקה 50 פיזיקה 60 מדעי המחשב 20 לומדים מתמטיקה ופיזיקה 25 מתמטיקה ומדעי המחשב 30 פיזיקה ומדעי המחשב ו-5 לומדים את שלושת המקצועות כמה סטודנטים לומדים לפחות מקצוע אחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '4f5a6b7c-8d9e-4012-a456-789abc123def',
    answers: [
      {
        id: 'f32d2330-e058-4404-964d-77ddfa628897',
        numberAnswer: {
          id: '00c0ee46-78a6-4e57-b29b-0d73192520c0',
          value: 80,
        },
      },
    ],
  },
  {
    id: '863a44be-8e03-47f1-88e2-69009ef72a55',
    translationId: '201abf55-c8fb-4b41-ab80-b373c958a084',
    text: {
      en_text: 'How many integers from 1 to 1000 are divisible by 3 or 4?',
      he_text: 'כמה מספרים שלמים בין 1 ל-1000 מתחלקים ב-3 או ב-4?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '4f5a6b7c-8d9e-4012-a456-789abc123def',
    answers: [
      {
        id: '9be9e6ba-c7d5-4a16-a582-c4f895550e53',
        numberAnswer: {
          id: '444a9828-033e-4d78-bb85-600ac328ee91',
          value: 500,
        },
      },
    ],
  },
  {
    id: 'b09577a0-f325-43eb-a04b-19f0244b38a2',
    translationId: '74700c15-53ae-4a51-b554-ecafeb5b6840',
    text: {
      en_text: 'How many three digit numbers are multiples of 2 or 5?',
      he_text: 'כמה מספרים בני שלוש ספרות הם כפולות של 2 או 5?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '4f5a6b7c-8d9e-4012-a456-789abc123def',
    answers: [
      {
        id: '1f3e768e-534e-4785-9cb6-f660b32f8c44',
        numberAnswer: {
          id: '0b6de177-0a5c-4fc6-8834-ad7e979b4df9',
          value: 540,
        },
      },
    ],
  },
  {
    id: '3d0e7cbc-c976-4aa5-a1ee-f9249617adf2',
    translationId: 'b7c0aefb-a927-4452-bc73-65d772e3da25',
    text: {
      en_text:
        '100 like coffee 80 tea 60 juice 30 like coffee and tea 25 coffee and juice 20 tea and juice and 10 like all three How many people like at least one drink?',
      he_text:
        '100 אוהבים קפה 80 תה 60 מיץ 30 אוהבים קפה ותה 25 קפה ומיץ 20 תה ומיץ ו-10 אוהבים את כל שלושת המשקאות כמה אנשים אוהבים לפחות משקה אחד?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '4f5a6b7c-8d9e-4012-a456-789abc123def',
    answers: [
      {
        id: 'bc09d484-3c91-418d-83ac-7c77378983de',
        numberAnswer: {
          id: '3bb2c27f-c7ff-4a08-bfbe-d0d92f747fc6',
          value: 175,
        },
      },
    ],
  },
  {
    id: '0078b5b8-2eef-4856-962a-67fb9441fe24',
    translationId: 'bdf204a0-0e77-46e1-b6e5-5002f7957a94',
    text: {
      en_text: 'How many integers from 1 to 100 are divisible by 2 or 3 or 5?',
      he_text: 'כמה מספרים שלמים בין 1 ל-100 מתחלקים ב-2 או ב-3 או ב-5?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '4f5a6b7c-8d9e-4012-a456-789abc123def',
    answers: [
      {
        id: 'd4c9233e-f3e5-42a0-9c53-66f9d6df3b16',
        numberAnswer: {
          id: '22989b36-971f-41f3-af25-0db84f485072',
          value: 74,
        },
      },
    ],
  },
  {
    id: 'e3281abd-5909-4fec-880e-68f8da4bbdc6',
    translationId: 'ef83ce26-fcfc-481d-a35a-96267fc5c3ea',
    text: {
      en_text:
        'How many permutations of the word APPLE start with A or end with E?',
      he_text: 'כמה סידורים של המילה APPLE מתחילים באות A או מסתיימים באות E?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '4f5a6b7c-8d9e-4012-a456-789abc123def',
    answers: [
      {
        id: '94fbc3d6-b524-4418-96e0-3f50be464088',
        numberAnswer: {
          id: '2245c703-4b41-453d-8ea4-2500bd977e50',
          value: 21,
        },
      },
    ],
  },
  {
    id: 'da5384d3-36b9-439d-81c7-4468b53d09bf',
    translationId: '80ecc9bb-afba-4377-8a64-cb95495ef4b8',
    text: {
      en_text: 'How many integers from 1 to 60 are not divisible by 2 or 3?',
      he_text: 'כמה מספרים שלמים בין 1 ל-60 אינם מתחלקים ב-2 או ב-3?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '4f5a6b7c-8d9e-4012-a456-789abc123def',
    answers: [
      {
        id: '51183f91-9a7d-49c7-b232-d33ec304bd8f',
        numberAnswer: {
          id: '994fe719-c40c-4b85-a7fd-81c5d1e1cea5',
          value: 20,
        },
      },
    ],
  },
  {
    id: 'd197e3c8-3d75-4351-9f9a-64c19a7b4f74',
    translationId: 'ef7e1d80-c1bf-4daf-a630-bb17cd366073',
    text: {
      en_text: 'How many 8-bit strings contain at least one 0',
      he_text: 'כמה מחרוזות באורך 8 מכילות לפחות אפס אחד',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '9adeaabb-69f1-46d4-bdb1-1e15b54bd091',
        numberAnswer: {
          id: '0f84e309-482d-41ee-a8a2-efdd21168c6f',
          value: 255,
        },
      },
    ],
  },
  {
    id: '34d9cdd1-9e6f-48df-be32-fabcfd1ab5a0',
    translationId: 'bd4445f4-6a67-4cbe-890c-2df27269c47d',
    text: {
      en_text: 'How many four digit numbers contain at least one digit 7',
      he_text: 'כמה מספרים בני ארבע ספרות מכילים לפחות ספרה אחת 7',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '158295eb-68dd-4fba-9bea-e2708d6a9410',
        numberAnswer: {
          id: 'affa5b6e-d4ca-4767-9cdb-e862ea5d5d71',
          value: 3168,
        },
      },
    ],
  },
  {
    id: 'ba270cb5-d635-41bf-8bc0-e02f794e1fb1',
    translationId: '19f79c58-69ed-418c-8ff5-0fd9a506437f',
    text: {
      en_text:
        'How many 6-letter strings from {A,B,C,D} contain at least one A',
      he_text: 'כמה מחרוזות באורך 6 מתוך {A,B,C,D} מכילות לפחות A אחת',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: 'a4b5cd8b-3262-4dac-9252-c884fd2f4fc2',
        numberAnswer: {
          id: '22a1a436-f9f3-4ffe-aae9-98863108dc22',
          value: 3367,
        },
      },
    ],
  },
  {
    id: '14da5f4c-c1ab-42a5-a6c8-ceda73f5d986',
    translationId: 'b7dbccce-a488-4a77-874c-c9d4f555d19d',
    text: {
      en_text:
        'How many four person committees from 10 students include at least one of two specific students',
      he_text:
        'כמה ועדות של ארבעה מתוך עשרה סטודנטים כוללות לפחות אחד משני סטודנטים מסוימים',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '40f0150d-8bfd-4f9a-88ef-02711eb52e31',
        numberAnswer: {
          id: '039b1b69-97da-422f-9770-d0cd45e5e8b3',
          value: 140,
        },
      },
    ],
  },
  {
    id: '31b9fc47-e768-47e5-9851-1e9a7b3c631e',
    translationId: '9e2473e6-161c-406f-9b55-dbf7d40e5dea',
    text: {
      en_text: 'How many permutations of ABCDE begin with a vowel',
      he_text: 'כמה סידורים של האותיות ABCDE מתחילים בתנועה',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '781982c2-4b33-49ae-a303-b02d55c27e42',
        numberAnswer: {
          id: 'db0f9be8-e92b-4054-9131-3b6b171c82eb',
          value: 48,
        },
      },
    ],
  },
  {
    id: '01eb567b-c978-409b-a7a1-ce0074384d49',
    translationId: '32c59695-81d3-4235-b701-277e19bcf732',
    text: {
      en_text: 'How many seven digit numbers have at least one digit 5',
      he_text: 'כמה מספרים בני שבע ספרות מכילים לפחות ספרה אחת 5',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '0183b574-1a56-4b0f-ab21-65ff304c4151',
        numberAnswer: {
          id: 'c1a0c98e-8f82-4585-aa2c-4b99d4c5fe70',
          value: 4748472,
        },
      },
    ],
  },
  {
    id: '142f8b3e-b45d-447b-8f62-eed97f162e2a',
    translationId: '5f557092-8bdc-443c-82dd-173197064bb7',
    text: {
      en_text:
        'How many colorings of 4 balls with 3 colors are not monochromatic',
      he_text: 'כמה צביעות של ארבעה כדורים בשלושה צבעים שאינן חד צבעוניות',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '8f7f6d39-46bf-4dc3-a4d6-40e0eb57ec22',
        numberAnswer: {
          id: 'c7f3ee67-1479-4b97-aba7-5c36d9b7672e',
          value: 78,
        },
      },
    ],
  },
  {
    id: '81360e39-00c4-457c-b830-89834c8fdfe8',
    translationId: '740f7595-295c-4e51-8250-6754eb18f8ea',
    text: {
      en_text:
        'How many 5-letter words from {A,B,C,D,E} have at least one repeated letter',
      he_text: 'כמה מילים באורך 5 מתוך {A,B,C,D,E} מכילות לפחות אות אחת שחוזרת',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '5286375e-b9de-40f5-9408-16431c118453',
        numberAnswer: {
          id: '91f10654-8733-4059-9161-cd18f44feead',
          value: 3005,
        },
      },
    ],
  },
  {
    id: 'b727573b-e1b5-4382-989d-bcc450db06cf',
    translationId: '3e5a2992-04db-463f-a8b1-8b9ff57426a0',
    text: {
      en_text: 'How many 5-digit strings contain at least one 0',
      he_text: 'כמה מחרוזות בנות חמש ספרות מכילות לפחות אפס אחד',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '394f3b35-a28f-4f15-80e2-0e1e82bf2159',
        numberAnswer: {
          id: '90a9666f-ac10-4950-92a2-4a7dc72ec7ab',
          value: 40951,
        },
      },
    ],
  },
  {
    id: 'f156e0a4-ce55-43b4-aa22-c740a684aae6',
    translationId: '6425ae2e-55ba-4fb0-ba94-63896bb5a549',
    text: {
      en_text:
        'How many permutations of four distinct digits include the digit 0',
      he_text: 'כמה סידורים בני ארבע ספרות שונות כוללים את הספרה 0',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: 'bb0525cb-b62a-4d11-8178-12b5dbf94811',
        numberAnswer: {
          id: 'c815c22d-c027-483b-89ae-aeb6fb4efc83',
          value: 2016,
        },
      },
    ],
  },
  {
    id: 'fa6c1642-52f4-488f-986b-c7af0b31efee',
    translationId: '2ffad47c-642b-4c62-acd0-06cbdcc794fd',
    text: {
      en_text:
        'How many 8-letter passwords over the lowercase English alphabet contain at least one vowel',
      he_text:
        'כמה סיסמאות באורך 8 מאותיות לועזיות קטנות מכילות לפחות תנועה אחת',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '0aea3000-072a-453d-8220-337cda42de6d',
        numberAnswer: {
          id: 'e62290c0-85bd-49e2-a2c1-fc820f3edb30',
          value: 171004205215,
        },
      },
    ],
  },
  {
    id: '947b2af5-5bb8-48e4-b6e3-b124a38a87ee',
    translationId: 'c184c555-8fe5-425f-aa46-06d67385cedf',
    text: {
      en_text:
        'How many 4-letter strings from {A,B,C,D,E,F} contain at least one vowel',
      he_text: 'כמה מחרוזות באורך 4 מתוך {A,B,C,D,E,F} מכילות לפחות תנועה אחת',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '22522021-4f00-496e-8871-ed2a46bebb38',
        numberAnswer: {
          id: '459c5752-f4dd-498f-8f01-3e4a75a1c605',
          value: 1040,
        },
      },
    ],
  },
  {
    id: 'bede7c3d-a729-4519-a5f7-4180955d1adf',
    translationId: '5f73cded-f705-4cb1-9c83-bbe4edb5aa8f',
    text: {
      en_text: 'How many three digit numbers have at least one repeated digit',
      he_text: 'כמה מספרים בני שלוש ספרות מכילים לפחות ספרה חוזרת אחת',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '093ec8e3-f24d-49b6-813b-13efd3aadcab',
        numberAnswer: {
          id: 'c5739f88-2482-4b2b-b418-19c8bf0331f3',
          value: 252,
        },
      },
    ],
  },
  {
    id: 'eb010669-7f22-4122-aefd-bb3241a4d391',
    translationId: 'babef5a8-53fd-42d7-b502-d7d5083439e5',
    text: {
      en_text:
        'How many 5-card hands from a standard deck contain at least one ace',
      he_text: 'כמה ידיים של חמש קלפים מחבילה רגילה מכילות לפחות אס אחד',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: 'c85d86ed-8f0e-4ed9-bc15-7100752b3070',
        numberAnswer: {
          id: 'efb7c932-695c-4dbd-ab2a-a0f5e8af45c6',
          value: 886656,
        },
      },
    ],
  },
  {
    id: 'e9c7cc22-e039-406a-bde5-de4d1d9809de',
    translationId: 'be678452-e71c-4c28-932b-592b751b559c',
    text: {
      en_text: 'How many 7-bit strings contain at least one 1',
      he_text: 'כמה מחרוזות באורך 7 ביטים מכילות לפחות ספרה אחת 1',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: 'ca568c7a-dd0b-4bc3-9c01-3f1d1db1f97b',
        numberAnswer: {
          id: 'b7f5c63d-a83b-42ae-b3eb-d2dd9966bd65',
          value: 127,
        },
      },
    ],
  },
  {
    id: 'c70bafe7-7d48-4916-84c2-d85bda658367',
    translationId: '7c17f31e-c1f9-4035-869f-e0b929e0122f',
    text: {
      en_text: 'How many subsets of {1,...,10} contain at least one of 1 or 2',
      he_text: 'כמה תתי קבוצות של {1,...,10} מכילות לפחות את 1 או 2',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: 'ebfc2260-7df1-40ce-8c80-535c1cae7371',
        numberAnswer: {
          id: '48d03b57-7086-4b37-9d5d-b61d773a9d39',
          value: 768,
        },
      },
    ],
  },
  {
    id: '0dcd28d3-543b-4767-b4bf-c6e69381291f',
    translationId: '464013a2-9067-44f6-9423-f8b7ae0763ad',
    text: {
      en_text:
        'How many permutations of numbers 1 through 5 have at least one fixed point',
      he_text: 'כמה תמורות של המספרים 1 עד 5 כוללות לפחות נקודת קיבוע אחת',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '190bbe1a-7a4a-4a38-951d-51f4c9a22982',
        numberAnswer: {
          id: '32f30d9b-43c0-475a-ba34-47c9240311ba',
          value: 76,
        },
      },
    ],
  },
  {
    id: '57e72e6e-f794-49f7-912a-a89e14d60250',
    translationId: '12388bcd-e3f3-4ee6-8447-d7c73adcc067',
    text: {
      en_text: 'How many four digit numbers contain at least one even digit',
      he_text: 'כמה מספרים בני ארבע ספרות מכילים לפחות ספרה זוגית אחת',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '01e2339f-5436-4c11-9b65-da19327e9aa4',
        numberAnswer: {
          id: 'dc590405-af8f-4855-91a1-bb08a05752c1',
          value: 8375,
        },
      },
    ],
  },
  {
    id: 'f5160286-1312-4b1e-89ef-6a5e9b5ecd05',
    translationId: '62478899-7c30-4628-ae5a-2c39e5d78bc2',
    text: {
      en_text: 'How many ternary strings of length 5 contain at least one 2',
      he_text: 'כמה מחרוזות באורך 5 בבסיס שלוש מכילות לפחות ספרה אחת 2',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: 'ba0fb684-2ade-4e38-a4ca-465575f9521a',
        numberAnswer: {
          id: '1d9fe301-a0db-4a4c-9aa8-5bad8f01bb39',
          value: 211,
        },
      },
    ],
  },
  {
    id: '2ef37e93-03e8-44cf-8d46-f9e959bb6370',
    translationId: 'b391d164-beba-42e6-ac33-c39059bbee3b',
    text: {
      en_text:
        'How many arrangements of three red and three blue balls in a row have at least one pair of adjacent balls of the same color',
      he_text:
        'כמה סידורים של שלושה כדורים אדומים ושלושה כחולים בשורה מכילים לפחות זוג סמוך של כדורים באותו צבע',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    answers: [
      {
        id: '1b2d2de5-ddd5-4963-9339-05d3acad7fcd',
        numberAnswer: {
          id: '98ab700a-37af-4326-aa60-e5198ae708b0',
          value: 18,
        },
      },
    ],
  },
  {
    id: 'f1f1199b-8535-40a8-a24e-85f90d4f79f5',
    translationId: 'e3d93d41-3050-493a-8ad6-19105b04613f',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(5, 2) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(5, 2) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '15ebcde4-e084-4113-8493-a8534ae081f7',
        numberAnswer: {
          id: '3f0ae1fc-4637-4e28-98d4-c5ee867a428e',
          value: 10,
        },
      },
    ],
  },
  {
    id: '053fef57-b721-4fc0-a182-661e79593209',
    translationId: 'a4e3c1a8-e257-4fe8-be97-f2c3cd035b13',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(6, 3) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(6, 3) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '6ccf46c4-361c-4c8b-b8b4-52905614831a',
        numberAnswer: {
          id: '1cdbf2b1-bddf-472e-956b-306a17a3b565',
          value: 20,
        },
      },
    ],
  },
  {
    id: '2cce300c-e714-4af8-a4f3-fc353468d03d',
    translationId: 'dcbdede0-9014-4c63-9981-cd22e7d1ec4f',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(7, 4) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(7, 4) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: 'bbb4371b-45e9-42e8-bf72-a0b149a245d0',
        numberAnswer: {
          id: '73a259a8-d418-40f7-8f03-7fecc67d812f',
          value: 35,
        },
      },
    ],
  },
  {
    id: '210937a0-8392-4661-85e0-ac34e5c51f4d',
    translationId: 'b12833a0-1b09-464a-ad7c-e148c216bccb',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(8, 2) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(8, 2) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '54d98d13-852d-4b40-9e49-c5efd83633cd',
        numberAnswer: {
          id: '031629a3-f13c-46fc-8814-893a405b6d41',
          value: 28,
        },
      },
    ],
  },
  {
    id: '30142fba-9dd7-4d33-b91d-cec9cacff81d',
    translationId: 'c532bcb3-323a-4fea-9a98-3a60be8b2db8',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(9, 5) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(9, 5) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '6ae6b923-d2fa-4a28-a3f9-2e1b704b0598',
        numberAnswer: {
          id: '8d76a894-d427-47f9-8785-435cc2c93243',
          value: 126,
        },
      },
    ],
  },
  {
    id: '758927d5-136f-45bd-a017-9ed0ff13b587',
    translationId: '4999aece-1387-4622-8f15-298daa82042f',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(10, 3) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(10, 3) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '4996aab1-8cac-4e64-9d3a-7d06c6cdc742',
        numberAnswer: {
          id: '0571b457-e375-4336-9ceb-192f13890f3d',
          value: 120,
        },
      },
    ],
  },
  {
    id: '16e7c749-51f8-4482-8b84-1cf9eec7fdbc',
    translationId: 'c4633ba3-7b62-43f4-b3ab-1bd1a6cf5376',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(11, 6) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(11, 6) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: 'a54d21c1-a5b9-4506-8a68-dc7fa859fd34',
        numberAnswer: {
          id: '2be6815b-5908-4b26-acaf-3102557b455d',
          value: 462,
        },
      },
    ],
  },
  {
    id: '42977405-31b2-44b9-9a50-a39caf11e7df',
    translationId: '7826ef3c-e828-425d-a27a-378ad632403b',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(12, 4) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(12, 4) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '611f5e86-ca84-4208-9f31-b8902cf9ee9d',
        numberAnswer: {
          id: '96cbc281-3efb-4eec-97cb-066ddfc3b338',
          value: 495,
        },
      },
    ],
  },
  {
    id: '51aaa9ae-f682-43b2-9865-07909157adc3',
    translationId: 'f43412c8-10de-4891-af23-2b01dd9926ec',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(13, 7) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(13, 7) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '054136a5-012e-42ea-8da0-dab1f491c814',
        numberAnswer: {
          id: 'e611c47e-9f8f-491f-8411-fc8e523d00ab',
          value: 1716,
        },
      },
    ],
  },
  {
    id: '1dac838b-24d1-42c1-a4fa-c39cfa911020',
    translationId: '76d2408f-653b-49ae-b9af-745ecfb4cd73',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(14, 2) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(14, 2) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: 'af4e6613-2e03-4201-9c41-ba6fa92c9de9',
        numberAnswer: {
          id: 'e771ec77-57b9-43df-8525-1147da647f8b',
          value: 91,
        },
      },
    ],
  },
  {
    id: '435a3fdb-fbeb-4fc2-bccb-5c1ae5d7c3b7',
    translationId: 'adf4012f-0b43-4416-91a2-74e10faac950',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(15, 5) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(15, 5) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '55821ae6-9be4-40f4-9c08-23d9149a6fcd',
        numberAnswer: {
          id: 'dd73a861-1d76-4403-bc8d-a1cff454ec92',
          value: 3003,
        },
      },
    ],
  },
  {
    id: '631e3d95-9be1-4b06-8c67-0b284c6743f4',
    translationId: '39c8fd20-7b0c-43db-a87f-a54e0f27d0ed',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(16, 8) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(16, 8) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: 'af28c0a7-966d-44f6-838f-4c77dde2ef8e',
        numberAnswer: {
          id: '64fd2b45-9e74-4914-a068-0c53f9fa0689',
          value: 12870,
        },
      },
    ],
  },
  {
    id: '8024ece5-d316-4f14-8095-02448b7319b4',
    translationId: 'cd4f8d35-467c-47d4-9f9f-7a7677aea4e5',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(17, 3) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(17, 3) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: 'b58f4b4d-d333-44f1-8039-e035eef5393d',
        numberAnswer: {
          id: 'de8b65bb-053b-46a6-b382-4317a3b7f400',
          value: 680,
        },
      },
    ],
  },
  {
    id: '67e9763f-efc6-42c5-a1d2-65a79ea8a6a5',
    translationId: '9aadd258-78f3-42a8-bc22-1fa381a4a773',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(18, 9) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(18, 9) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '87dd2b44-d72d-4435-9013-59677bc41111',
        numberAnswer: {
          id: '9d5fc71b-47c7-42ef-9f78-6a4bb38c43a8',
          value: 48620,
        },
      },
    ],
  },
  {
    id: 'ed24fe0e-e03b-487e-bc4e-024185cc1eed',
    translationId: '17d9e6b4-0346-4b44-8e41-9ee32e401f08',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(19, 4) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(19, 4) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '764b3d07-ebd3-4394-875a-ae510a6523ae',
        numberAnswer: {
          id: 'a6d9b174-3b3e-4350-a426-71e53888c060',
          value: 3876,
        },
      },
    ],
  },
  {
    id: '67521599-9c4d-4caa-b954-28d693b455a9',
    translationId: 'ae1945da-835a-4a0d-bac9-ee97eb818b7e',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(20, 10) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(20, 10) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '1aefa9a9-d3d8-43c0-ae55-003af752fd31',
        numberAnswer: {
          id: '0313e149-c1fa-42d1-9b5b-b8a5a1175f38',
          value: 184756,
        },
      },
    ],
  },
  {
    id: 'a8d52088-a920-4c15-8430-cb64ed141c8b',
    translationId: 'ad136e05-f9ee-4a20-91fc-a4b411bd1506',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(21, 7) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(21, 7) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '50e669f1-d096-4568-be90-77f6b9d28200',
        numberAnswer: {
          id: 'c04e6f38-40f4-4ebd-8fd0-3c5ebecd113f',
          value: 116280,
        },
      },
    ],
  },
  {
    id: '9e0d0fae-3372-47b1-ada0-cf4bed191b06',
    translationId: '1cd52c38-19eb-430a-8ac6-404cbb9c14b6',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(22, 11) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(22, 11) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: 'a61a26d1-2184-4940-b7ff-583ee595eddf',
        numberAnswer: {
          id: '17a8cbbc-0797-4995-bc6c-079f575aee09',
          value: 705432,
        },
      },
    ],
  },
  {
    id: '3ca98efb-fadd-43c7-b769-54eaf0af0f8d',
    translationId: '70c7622b-23c5-4de7-9bcd-198748654be4',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(23, 5) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(23, 5) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: 'e26f0543-475c-4636-951e-23c273e8aa62',
        numberAnswer: {
          id: '1e556fad-38cb-458e-a3fa-0b7784f0308e',
          value: 33649,
        },
      },
    ],
  },
  {
    id: '571753da-c324-43dc-b470-af03755d33ca',
    translationId: '26d7aa85-f8ad-4484-b9dc-5a3dc992c4db',
    text: {
      en_text:
        "What is the value of the binomial coefficient C(24, 12) found in Pascal's Triangle?",
      he_text: 'מהו הערך של המקדם הבינומי C(24, 12) במשולש פסקל?',
    },
    type: QuestionType.value,
    validationStatus: QuestionValidationStatus.ai_generated,
    moduleId: '82da973e-a84a-44f4-b33f-bcf907961eb3',
    answers: [
      {
        id: '4a61612b-9fe1-45d0-8526-3c7703858700',
        numberAnswer: {
          id: 'b2eb2cc0-88dd-431c-903c-65a283d65d64',
          value: 2704156,
        },
      },
    ],
  },
] satisfies QuestionSeedData[];
