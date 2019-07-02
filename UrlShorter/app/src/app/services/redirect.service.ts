import { CanActivate } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/router';


export class RedirectService implements CanActivate {

    constructor(private api: ApiService) {
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        debugger;
        const hash = route.params.hash;
        const url = await this.api.resolve(hash);
        const res = !url;
        if (!res) {
            document.location.replace(url);
        }
        return res;
    }

  
}
