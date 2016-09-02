export const generic = /\b(https?):\/\/\S+?\/\S+\.(?:jpe?g|gif|png|webp)\b(?:\?\S+)?/gi;
export const webm = /\b(https?):\/\/\S+?\/\S+\.webm\b(?:\?\S+)?/gi;
export const gifv = /\bhttps?:\/\/i\.imgur\.com\/(?:.{7})\.(?:gifv|mp4|webm)/gi;
export const youTube = /\bhttps?:\/\/(?:www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/gi;
