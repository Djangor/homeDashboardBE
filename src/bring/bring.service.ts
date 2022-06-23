import { Injectable } from '@nestjs/common';
import { CONSTANTS } from "../Constants";
import { HttpService } from "@nestjs/axios";
const bringApi = require(`bring-shopping`);


@Injectable()
export class BringService {

  constructor(private httpService: HttpService) {}

  cachedItems: object[];
  cachedItemsTSD: number;



  async getItems(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const currNow = Date.now();
      if (currNow - this.cachedItemsTSD < CONSTANTS.bring.cacheMS && this.cachedItems && this.cachedItems.length > 0) {
        console.log('taking cached entries');
        resolve(this.cachedItems);
      } else {
        const bring = new bringApi({mail: CONSTANTS.bring.username, password: CONSTANTS.bring.password});

        bring.login()
          .then(() => {
            console.log(`Successfully logged in as ${bring.name}`);
            bring.getItems(CONSTANTS.bring.listId)
              .then((list) => {
                this.cachedItemsTSD = Date.now();
                this.cachedItems = list.purchase;
                resolve(list.purchase);
              })
              .catch(err => {
                console.log('Error getting Lists: ' + JSON.stringify(err))
                resolve({})
              })
          })
          .catch (err => {
          console.error('Error on Login: ' + JSON.stringify(err));
          resolve({})
        });
      }
    })
  }

  getLists(): Promise<any> {
    return new Promise<any>((resolve) => {
      const bring = new bringApi({mail: CONSTANTS.bring.username, password: CONSTANTS.bring.password});

      bring.login()
        .then(() => {
          console.log('Successfully logged in');
          bring.loadLists()
            .then((lists) => {
              resolve(lists);
            })
            .catch(err => {
              console.log('Error getting Lists: ' + JSON.stringify(err))
              resolve({})
            })
        })
        .catch (err => {
          console.error('Error on Login: ' + JSON.stringify(err));
          resolve(err)
        });
    })
  }


}

