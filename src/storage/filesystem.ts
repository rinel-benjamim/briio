import { File, Directory, Paths } from "expo-file-system";

const BASE_DIR = new Directory(Paths.document, "Briio");
const PHOTOGRAPHS_DIR = new Directory(BASE_DIR, "photographs");
const PDFS_DIR = new Directory(BASE_DIR, "pdfs");

function ensureDirectoryExists(dir: Directory) {
  if (!dir.exists) {
    dir.create();
  }
}

export function getPhotographsDir(rdoId: string): Directory {
  const dir = new Directory(PHOTOGRAPHS_DIR, rdoId);
  ensureDirectoryExists(dir);
  return dir;
}

export function getPdfsDir(): Directory {
  ensureDirectoryExists(PDFS_DIR);
  return PDFS_DIR;
}

export function savePhotograph(
  rdoId: string,
  photoId: string,
  uri: string,
  extension: string = "jpg",
): string {
  const dir = getPhotographsDir(rdoId);
  const dest = new File(dir, `${photoId}.${extension}`);
  const src = new File(uri);
  src.copySync(dest);
  return dest.uri;
}

export function deletePhotograph(uri: string) {
  const file = new File(uri);
  if (file.exists) {
    file.delete();
  }
}

export function getPhotographUri(
  rdoId: string,
  photoId: string,
  extension: string = "jpg",
): string | null {
  const dir = PHOTOGRAPHS_DIR;
  const uri = `${dir.uri}${rdoId}/${photoId}.${extension}`;
  const file = new File(uri);
  return file.exists ? file.uri : null;
}

export function savePdf(rdoId: string, uri: string): string {
  const dir = getPdfsDir();
  const dest = new File(dir, `${rdoId}.pdf`);
  const src = new File(uri);
  src.copySync(dest, { overwrite: true });
  return dest.uri;
}

export function getPdfUri(rdoId: string): string | null {
  const uri = `${PDFS_DIR.uri}${rdoId}.pdf`;
  const file = new File(uri);
  return file.exists ? file.uri : null;
}

export function deletePdf(rdoId: string) {
  const uri = getPdfUri(rdoId);
  if (uri) {
    const file = new File(uri);
    file.delete();
  }
}

export function deleteAllRdoData(rdoId: string) {
  const photoDir = new Directory(PHOTOGRAPHS_DIR, rdoId);
  if (photoDir.exists) {
    photoDir.delete();
  }
  deletePdf(rdoId);
}
