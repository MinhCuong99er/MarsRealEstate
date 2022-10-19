// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { body = {}, method } = req
  if (method == 'POST') {
    res.status(200).json({ data: body })
  }
  if (method == 'GET') {
    res.status(200).json({
      code: 0,
      data: { token: 'John Doe', auth: { name: 'Josh Doe' } },
    })
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default handler
