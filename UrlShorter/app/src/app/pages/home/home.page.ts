import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { map, flatMap, debounceTime, retryWhen, filter } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

@Component({
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss']
})
export class HomePage {

    public form: FormGroup;

    /** The shorten URL is valid and exists */
    public isShortenUrl: boolean;

    /** HTTP request is processing now */
    public isProcessing: boolean;

    /** Current editing URL */
    public newUrl: string;

    /** Full URL resolved from shorten one */
    fullUrl: string;


    @ViewChild('editDialog', {static: true}) editDialogTmpl: TemplateRef<any>;
    @ViewChild('deleteDialog', {static: true}) deleteDialogTmpl: TemplateRef<any>;

    constructor(fb: FormBuilder, private apiService: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {

        this.form = fb.group({
            url: ['', Validators.pattern(/^http[s]?:\/\/.+/i)],
            shortenUrl: ['', Validators.compose([Validators.pattern(/^http[s]?:\/\/.+/i)])]
        });

        // checking if the shorten url is valid
        this.form.controls.shortenUrl.valueChanges.pipe(
            map(value => {
                this.fullUrl = null;
                this.isShortenUrl = null;
                return value;
            }),
            debounceTime(500),
            filter(value => value && this.form.controls.shortenUrl.valid),
            flatMap((value: string) => apiService.resolve$(value)),
            retryWhen(errs => errs)
        )
        .subscribe(value => {
            this.fullUrl = this.setFullUrl(<any>value);
            this.isShortenUrl = !!value;
        });
    }

    /** Extracts the error text from exception (very simple sample)  */
    extractError(e) {
        let res = e.error && (e.error.message || e.error.title);
        if (!res) {
            res = e.message || e.statusText || e;
        }
        return res;
    }

    /** Checks if the url is valid and returns it. Returns `null` otherwise. */
    public setFullUrl(url: string) {
        if (url && /^http[s]?:\/\/.+/i.test(url)) {
            return url;
        } else {
            return null;
        }
    }

    /** Makes shorten url. */
    public async makeUrl(url: string): Promise<string> {
        this.isProcessing = true;
        try {
            const result = await this.apiService.make(url);
            this.form.controls.shortenUrl.setValue(result);
            this.form.controls.url.setValue('');
            return result;
        } catch (e) {
            this.snackBar.open(this.extractError(e), 'OK');
            throw e;
        } finally {
            this.isProcessing = false;
        }
    }

    /** Edits the current shorten url. */
    public editUrl(url: string): void {
        this.newUrl = this.fullUrl;
        const dialogRef = this.dialog.open(this.editDialogTmpl);
        dialogRef.afterClosed().pipe(
            filter(res => res),
            flatMap(res => {
                return this.apiService.edit$(url, res);
            })
        )
        .subscribe(
            res => {
                if (res) {
                    this.fullUrl = this.newUrl;
                    this.snackBar.open('The shorten url has been changed.', 'OK');
                }
            },
            e => {
                this.snackBar.open(e, 'OK');
            });
    }

    /** Removes the current shorten url. */
    public deleteUrl(url: string): void {
        const dialogRef = this.dialog.open(this.deleteDialogTmpl);
        dialogRef.afterClosed().pipe(
            filter(res => res),
            flatMap(() => this.apiService.delete$(url))
        )
        .subscribe(
            res => {
                if (res) {
                    this.form.controls.shortenUrl.setValue('');
                    this.snackBar.open('The shorten url has been deleted.', 'OK');
                }
            },
            e => {
                this.snackBar.open(this.extractError(e), 'OK');
            });
    }
}

