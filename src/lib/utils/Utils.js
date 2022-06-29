/**
 * If path is an ipfsUrl, return just the ipfs path, otherwise returns the path param
 *
 * @param {string} path the path to clean
 */
export const cleanIpfsPath = path => {
    const re = new RegExp(/\/ipfs\/\w+$/);
    const match = re.exec(path);
    if (match) {
        return match[0];
    }
    return path;
};