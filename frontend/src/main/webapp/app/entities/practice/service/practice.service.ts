import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPractice, NewPractice } from '../practice.model';

export type PartialUpdatePractice = Partial<IPractice> & Pick<IPractice, 'id'>;

type RestOf<T extends IPractice | NewPractice> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestPractice = RestOf<IPractice>;

export type NewRestPractice = RestOf<NewPractice>;

export type PartialUpdateRestPractice = RestOf<PartialUpdatePractice>;

export type EntityResponseType = HttpResponse<IPractice>;
export type EntityArrayResponseType = HttpResponse<IPractice[]>;

@Injectable({ providedIn: 'root' })
export class PracticeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/practices');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(practice: NewPractice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(practice);
    return this.http
      .post<RestPractice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(practice: IPractice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(practice);
    return this.http
      .put<RestPractice>(`${this.resourceUrl}/${this.getPracticeIdentifier(practice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(practice: PartialUpdatePractice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(practice);
    return this.http
      .patch<RestPractice>(`${this.resourceUrl}/${this.getPracticeIdentifier(practice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPractice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPractice[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPracticeIdentifier(practice: Pick<IPractice, 'id'>): number {
    return practice.id;
  }

  comparePractice(o1: Pick<IPractice, 'id'> | null, o2: Pick<IPractice, 'id'> | null): boolean {
    return o1 && o2 ? this.getPracticeIdentifier(o1) === this.getPracticeIdentifier(o2) : o1 === o2;
  }

  addPracticeToCollectionIfMissing<Type extends Pick<IPractice, 'id'>>(
    practiceCollection: Type[],
    ...practicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const practices: Type[] = practicesToCheck.filter(isPresent);
    if (practices.length > 0) {
      const practiceCollectionIdentifiers = practiceCollection.map(practiceItem => this.getPracticeIdentifier(practiceItem)!);
      const practicesToAdd = practices.filter(practiceItem => {
        const practiceIdentifier = this.getPracticeIdentifier(practiceItem);
        if (practiceCollectionIdentifiers.includes(practiceIdentifier)) {
          return false;
        }
        practiceCollectionIdentifiers.push(practiceIdentifier);
        return true;
      });
      return [...practicesToAdd, ...practiceCollection];
    }
    return practiceCollection;
  }

  protected convertDateFromClient<T extends IPractice | NewPractice | PartialUpdatePractice>(practice: T): RestOf<T> {
    return {
      ...practice,
      startDate: practice.startDate?.toJSON() ?? null,
      endDate: practice.endDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPractice: RestPractice): IPractice {
    return {
      ...restPractice,
      startDate: restPractice.startDate ? dayjs(restPractice.startDate) : undefined,
      endDate: restPractice.endDate ? dayjs(restPractice.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPractice>): HttpResponse<IPractice> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPractice[]>): HttpResponse<IPractice[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
