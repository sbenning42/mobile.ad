export const baseApi = 'http://preprod.myauthenticdesign.fr/api';
export const basePicturesApi = 'http://preprod.myauthenticdesign.fr/public/storage/';
export const stockApi = `${baseApi}/private-products`;
export const galleryApi = `${baseApi}/shared-gallery`;
export const annexesApi = `${baseApi}/annexes`;
export const channelsApi = `${baseApi}/me/marketplaces/contracted`;
export const channelsPublishApi = `${baseApi}/mypush`;

export class Api {
    public static base = baseApi;
    public static baseFile = basePicturesApi;
    public static annexes = annexesApi;
    public static meChannels = channelsApi;
    public static stock = stockApi;
    public static gallery = galleryApi;
    public static publishChannel = channelsPublishApi;
}