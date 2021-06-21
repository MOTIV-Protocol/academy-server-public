import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ko from 'javascript-time-ago/locale/ko';
import { Imagable, SelfImage } from '@constants/schema';
import { api_url } from '../api';
import _ from 'lodash';

export const currency = function (data: number) {
  if (!data) return '0';
  else return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const simpleFormat = function (text: string) {
  try {
    let wrapper_tag = 'p';
    let textArr = _.isString(text) ? text.split(/(?:\r\n|\r|\n)/g) : [];
    textArr = _.map(textArr, (v) => `<${wrapper_tag}> ${v} </${wrapper_tag}>`);
    return [_.join(textArr, '\n')];
  } catch {
    return 'Simple Format Error';
  }
};

export const imagePath = (instance: SelfImage | Imagable) =>
  (instance as SelfImage)?.image_path
    ? `${api_url}${(instance as SelfImage)?.image_path}`
    : (instance as Imagable)?.images?.length > 0
    ? imagePath((instance as Imagable)?.images[0])
    : null;

export const thumbnailPath = (instance: SelfImage | Imagable) =>
  (instance as SelfImage)?.thumbnail_path
    ? `${api_url}${(instance as SelfImage)?.thumbnail_path}`
    : (instance as Imagable)?.images?.length > 0
    ? thumbnailPath((instance as Imagable)?.images[0])
    : null;

export const distanceByLatLng = function (lat1: number, lng1: number, lat2: number, lng2: number) {
  const deg2rad = (deg) => deg * (Math.PI / 180);
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lng2 - lng1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
};

try {
  TimeAgo.addLocale(en);
  TimeAgo.addLocale(ko);
  TimeAgo.addDefaultLocale(ko);
} catch (e) {} // HMR로 중복적용되어 문제생기는 상황 있어서 오류 무시
export const timeAgo = new TimeAgo();
export const dateToText = (date: string) => timeAgo.format(new Date(date));
