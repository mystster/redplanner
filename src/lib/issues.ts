// tslint:disable:max-classes-per-file variable-name
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

export class Issues {
  public issues: Issue[];
  public total_count = 0;
  public offset = 0;
  public limit = 0;

  constructor(json: any) {
    this.issues = [];
    if (json) {
      json.issues.forEach((element: any) => {
        this.issues.push(new Issue(element));
      });
      this.total_count = json.total_count;
      this.offset = json.offset;
      this.limit = json.limit;
    }
  }
}
export class Issue {
  public id: number;
  public project: FieldObject;
  public tracker: FieldObject;
  public status: FieldObject;
  public priority: FieldObject;
  public author: FieldObject;
  public assigned_to: FieldObject;
  public subject: string;
  public description: string;
  public due_date: dayjs.Dayjs | null;
  public done_ratio: number;
  public start_date: dayjs.Dayjs | null;
  public custom_fields: CustomFieldObject[];
  public relations: Relation[];
  public created_on: string;
  public updated_on: string;

  constructor(json: any) {
    this.id = json.id;
    this.project = json.project;
    this.tracker = json.tracker;
    this.status = json.status;
    this.priority = json.priority;
    this.author = json.author;
    this.assigned_to = json.assigned_to;
    this.subject = json.subject;
    this.description = json.description;
    this.due_date = !json.due_date ? null : dayjs(json.due_date);
    this.start_date = !json.start_date ? null : dayjs(json.start_date);
    this.done_ratio = json.done_ratio;
    this.custom_fields = json.custom_fields;
    this.relations = json.relations;
    this.created_on = json.created_on;
    this.updated_on = json.updated_on;
  }

  /**
   * カスタムフィールドの値を取得する
   * @param id 値を取得するカスタムフィールドのID
   */
  public getCustomFieldValue(id: number): string {
    const customFields = this.custom_fields.filter((v) => v.id === id);
    if (!customFields || customFields.length === 0) {
      return '';
    }
    return customFields.map((v) => v.value).join(',');
  }

  /**
   * カスタムフィールドの値を設定する
   *
   * @param {number} id 設定するカスタムフィールドのID
   * @param {string} value 設定する値
   * @memberof Issue
   */
  public setCustomFieldValue(id: number, value: string) {
    if (this.custom_fields === null) {
      this.custom_fields = [];
    }
    const customField = this.custom_fields.filter((v) => v.id === id);
    if (!customField || customField.length === 0) {
      this.custom_fields.push({
        id,
        name: '',
        value
      });
    } else {
      customField[0].value = value;
    }
  }
}

export class FieldObject {
  public id = 0;
  public name = '';
}
export class CustomFieldObject {
  public id = 0;
  public name = '';
  public value = '';
}
export class Relations {
  public relations: Relation[] = [];
}
export class Relation {
  public id = 0;
  public issue_id = 0;
  public issue_to_id = 0;
  public relation_type = '';
  public delay = 0;
}
