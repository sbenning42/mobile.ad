export const baseApi = 'http://preprod.myauthenticdesign.fr/api';
export const basePicturesApi = 'http://preprod.myauthenticdesign.fr/public/storage/';
export const stockApi = `${baseApi}/private-products`;
export const galleryApi = `${baseApi}/shared-gallery`;
export const annexesApi = `${baseApi}/annexes`;
export const channelsApi = `${baseApi}/me/marketplaces/contracted`;
export const allChannelsApi = `${baseApi}/marketplaces`;
export const user = `${baseApi}/myusers`;
export const userPicture = `${baseApi}/user/mypictures`;
export const userAddresses = `${baseApi}/user/myaddresses`;
export const channelsPublishApi = (articleId, channelId) => `${baseApi}/v2/products/${articleId}/marketplaces/${channelId}`;
export const userInfos = id => `${baseApi}/users/${id}/public-infos`;
export const userAccount = id => `${baseApi}/users/${id}/account`;
export const addArticle = `${baseApi}/myproducts`;
export const uploadArticlePicture = `${baseApi}/product/upload`;

export class Api {
    public static base = baseApi;
    public static baseFile = basePicturesApi;
    public static annexes = annexesApi;
    public static meChannels = channelsApi;
    public static channels = allChannelsApi;
    public static stock = stockApi;
    public static gallery = galleryApi;
    public static user = user;
    public static userPicture = userPicture;
    public static userAddresses = userAddresses;
    public static publishChannel = (articleId, channelId) => channelsPublishApi;
    public static userInfo = id => userInfos(id);
    public static userAccount = id => userAccount(id);
    public static addArticle = addArticle;
    public static uploadArticlePicture = uploadArticlePicture;
}