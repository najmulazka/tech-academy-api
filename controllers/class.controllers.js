const prisma = require('../utils/libs/prisma.libs');
const imagekit = require('../utils/libs/imagekit.libs');
const path = require('path');

const createClass = async (req, res, next) => {
  try {
    let { className, description, categoryName, price, isFree, levelName } = req.body;
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'File is required',
        data: null,
      });
    }

    let strFile = req.file.buffer.toString('base64');
    const { url, fileId } = await imagekit.upload({
      fileName: Date.now() + path.extname(req.file.originalname),
      file: strFile,
    });

    let classCode = '';
    let result = categoryName.split(' ');
    for (let i = 0; i < result.length; i++) {
      classCode += result[i][0];
    }
    let countClass = await prisma.class.count();
    classCode += countClass.toString();

    const classs = await prisma.class.create({
      data: {
        classCode,
        className,
        description,
        thumbnailPicture: url,
        fileId,
        price: Number(price),
        isFree: Boolean(isFree),
        levelName,
        categorys: {
          create: [
            {
              categorys: {
                connectOrCreate: {
                  where: {
                    categoryName,
                  },
                  create: {
                    categoryName,
                  },
                },
              },
            },
          ],
        },
      },
    });

    res.status(200).json({
      status: true,
      message: 'OK',
      err: null,
      data: classs,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createClass };
