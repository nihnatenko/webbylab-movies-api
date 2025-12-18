const fs = require('fs');
const readline = require('readline');

const parseFile = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const movies = [];
  let currentMovie = {};

  for await (const line of rl) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('Title:')) {
      currentMovie.title = trimmedLine.replace('Title:', '').trim();
    } else if (trimmedLine.startsWith('Release Year:')) {
      currentMovie.releaseYear = parseInt(trimmedLine.replace('Release Year:', '').trim(), 10);
    } else if (trimmedLine.startsWith('Format:')) {
      currentMovie.format = trimmedLine.replace('Format:', '').trim();
    } else if (trimmedLine.startsWith('Stars:')) {
      currentMovie.stars = trimmedLine
        .replace('Stars:', '')
        .split(',')
        .map((star) => star.trim());
    } else if (trimmedLine === '' && Object.keys(currentMovie).length > 0) {
      movies.push(currentMovie);
      currentMovie = {};
    }
  }

  if (Object.keys(currentMovie).length > 0) movies.push(currentMovie);

  return movies;
};

module.exports = parseFile;
