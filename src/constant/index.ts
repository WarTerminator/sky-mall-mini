export enum ProdType {
  score = 3
}

export const officialShopLogo = '2023/10/d46062511b2a425b8464a39480ec57fa.png';
export const LOGO = 'https://img.war6sky.com/2024/08/6b6917c097764d1282b593e813e9e453.png';


export enum TermType {
  month = 3,
  season = 4,
  year = 5,
}

interface IConfig {
  termType: TermType,
  name: string;
  discount: number;
}

export const VIPConfigMap: Record<number, IConfig> = {
  [TermType.month]: {
    termType: 3,
    name: '月卡',
    discount: 9.5,
  },
  [TermType.season]: {
    termType: 4,
    name: '季卡',
    discount: 9,
  },
  [TermType.year]: {
    termType: 5,
    name: '年卡',
    discount: 8,
  },
};
