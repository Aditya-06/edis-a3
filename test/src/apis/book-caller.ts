import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import {Request, Response} from 'express';
import replaceGenre from '../middleware/replace-genre';

const bookCaller = async (req: Request, res: Response) => {
  console.log(`${process.env.BOOK_ALB_NAME}`);

  const config: AxiosRequestConfig = {
    method: req.method,
    url: `http://${process.env.BOOK_ALB_NAME}${req.originalUrl}`,
    headers: {},
  };
  try {
    const response: AxiosResponse = await axios(config);
    const status: number = response.status;
    if (
      req.method === 'GET' &&
      (req.originalUrl.startsWith('/books/isbn/') ||
        req.originalUrl.startsWith('/books/'))
    ) {
      const finalResponse = replaceGenre(response.data);
      console.log(response.data);
      return res.status(status).send(finalResponse);
    }
    return res.status(status).send(response.data);
  } catch (e: any) {
    const errorStatus = e.response.status;
    if (errorStatus >= 400 && errorStatus < 500)
      return res.status(e.response.status).json(e.response.data);
    return res.status(500).json({message: 'Server error :('});
  }
};

export default bookCaller;
