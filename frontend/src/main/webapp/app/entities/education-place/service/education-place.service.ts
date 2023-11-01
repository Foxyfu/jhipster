import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEducationPlace, NewEducationPlace } from '../education-place.model';

export type PartialUpdateEducationPlace = Partial<IEducationPlace> & Pick<IEducationPlace, 'id'>;

export type EntityResponseType = HttpResponse<IEducationPlace>;
export type EntityArrayResponseType = HttpResponse<IEducationPlace[]>;

@Injectable({ providedIn: 'root' })
export class EducationPlaceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/education-places');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(educationPlace: NewEducationPlace): Observable<EntityResponseType> {
    return this.http.post<IEducationPlace>(this.resourceUrl, educationPlace, { observe: 'response' });
  }

  update(educationPlace: IEducationPlace): Observable<EntityResponseType> {
    return this.http.put<IEducationPlace>(`${this.resourceUrl}/${this.getEducationPlaceIdentifier(educationPlace)}`, educationPlace, {
      observe: 'response',
    });
  }

  partialUpdate(educationPlace: PartialUpdateEducationPlace): Observable<EntityResponseType> {
    return this.http.patch<IEducationPlace>(`${this.resourceUrl}/${this.getEducationPlaceIdentifier(educationPlace)}`, educationPlace, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEducationPlace>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEducationPlace[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEducationPlaceIdentifier(educationPlace: Pick<IEducationPlace, 'id'>): number {
    return educationPlace.id;
  }

  compareEducationPlace(o1: Pick<IEducationPlace, 'id'> | null, o2: Pick<IEducationPlace, 'id'> | null): boolean {
    return o1 && o2 ? this.getEducationPlaceIdentifier(o1) === this.getEducationPlaceIdentifier(o2) : o1 === o2;
  }

  addEducationPlaceToCollectionIfMissing<Type extends Pick<IEducationPlace, 'id'>>(
    educationPlaceCollection: Type[],
    ...educationPlacesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const educationPlaces: Type[] = educationPlacesToCheck.filter(isPresent);
    if (educationPlaces.length > 0) {
      const educationPlaceCollectionIdentifiers = educationPlaceCollection.map(
        educationPlaceItem => this.getEducationPlaceIdentifier(educationPlaceItem)!,
      );
      const educationPlacesToAdd = educationPlaces.filter(educationPlaceItem => {
        const educationPlaceIdentifier = this.getEducationPlaceIdentifier(educationPlaceItem);
        if (educationPlaceCollectionIdentifiers.includes(educationPlaceIdentifier)) {
          return false;
        }
        educationPlaceCollectionIdentifiers.push(educationPlaceIdentifier);
        return true;
      });
      return [...educationPlacesToAdd, ...educationPlaceCollection];
    }
    return educationPlaceCollection;
  }
}
