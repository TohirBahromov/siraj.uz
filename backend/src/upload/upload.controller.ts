import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';

const UPLOADS_ROOT = path.resolve(process.cwd(), '..', 'uploads');
const ALLOWED_FOLDERS = ['staff', 'categories', 'products'] as const;

if (!fs.existsSync(UPLOADS_ROOT)) {
  fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
}

const editFileName = (
  _req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const name = file.originalname.split('.')[0];
  const ext = extname(file.originalname);
  const rand = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${rand}${ext}`);
};

@Controller('admin/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, _file, callback) => {
          const folder = req.query?.folder as string | undefined;
          if (folder && !ALLOWED_FOLDERS.includes(folder as any)) {
            return callback(
              new BadRequestException(`Invalid upload folder: ${folder}`),
              '',
            );
          }
          const dest = folder
            ? join(UPLOADS_ROOT, folder)
            : UPLOADS_ROOT;
          fs.mkdirSync(dest, { recursive: true });
          callback(null, dest);
        },
        filename: editFileName,
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    const urlPath = folder ? `/uploads/${folder}/${file.filename}` : `/uploads/${file.filename}`;
    return { url: urlPath };
  }
}
