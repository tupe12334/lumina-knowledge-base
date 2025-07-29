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
    moduleId: '9c8e5d2a-4b7f-4c8d-9e0a-1b2c3d4e5f6a',
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
] satisfies QuestionSeedData[];
