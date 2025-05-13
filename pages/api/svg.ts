import type { NextApiRequest, NextApiResponse } from "next";

const hex = (num: number, len: number) => (Array(len).join('0') + num.toString(16)).slice(-len);

const parseColor = (color: string | string[]) => {
  const _color = (Array.isArray(color)) ? color[0] : color;
  if (_color.startsWith('(')) {
    const match = _color.match(/\((.*?)\)/);
    if (match) {
      const rgb = match[1].split(',').map(num => parseInt(num, 10))
      return hex(rgb[0], 2) + hex(rgb[1], 2) + hex(rgb[2], 2)
    }
  }
  else if (_color.match(/^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/)) {
    return _color;
  }
  throw Error(`Invalid color format. (You sent: ${color}) \nPlease use a \n\t6-digit hexadecimal format (e.g., #ff0000), \n\ta 3-digit shorthand hexadecimal format (e.g., #0f0), \n\tor a decimal RGB format (e.g., (000, 000, 255)).`);
}

export default function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const message = req.query.message;
    const m = ((Array.isArray(message)) ? message[0] : message)?.split("") || [];

    const col1 = parseColor(req.query.col1 || "000");
    const col2 = parseColor(req.query.col2 || "000");
    const col3 = parseColor(req.query.col3 || "000");
    const col4 = parseColor(req.query.col4 || "000");

    const battenberg_svg = [
      `<svg width="705" height="727" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" overflow="hidden">`,
      `<g transform="translate(-2649 -518)">`,
      `<rect x="2746" y="565" width="511" height="566" fill="#FFFFFF" />`,
      `<text fill="#${col1}" font-family="HGSoeiKakupoptai,HGSoeiKakupoptai_MSFontService,Hiragino Sans,Hiragino Kaku Gothic ProN,ヒラギノ角ゴシック,sans-serif" font-weight="400" font-size="220" transform="matrix(1 0 0 1 2781.94 811)">${m[0] || ""}</text>`,
      `<text fill="#${col2}" font-family="HGSoeiKakupoptai,HGSoeiKakupoptai_MSFontService,Hiragino Sans,Hiragino Kaku Gothic ProN,ヒラギノ角ゴシック,sans-serif" font-weight="400" font-size="220" transform="matrix(1 0 0 1 3001.94 811)">${m[1] || ""}</text>`,
      `<text fill="#${col3}" font-family="HGSoeiKakupoptai,HGSoeiKakupoptai_MSFontService,Hiragino Sans,Hiragino Kaku Gothic ProN,ヒラギノ角ゴシック,sans-serif" font-weight="400" font-size="220" transform="matrix(1 0 0 1 2781.94 1075)">${m[2] || ""}</text>`,
      `<text fill="#${col4}" font-family="HGSoeiKakupoptai,HGSoeiKakupoptai_MSFontService,Hiragino Sans,Hiragino Kaku Gothic ProN,ヒラギノ角ゴシック,sans-serif" font-weight="400" font-size="220" transform="matrix(1 0 0 1 3001.94 1075)">${m[3] || ""}</text>`,
      `</g>`,
      `</svg>`
    ].join();
    res.setHeader("Content-Type", "image/svg+xml; charaset=utf-8");

    res.status(200).send(battenberg_svg)
  }
  catch (e: any) {
    res.setHeader("Content-Type", "text");
    res.status(400).send(e.message);
  }
}