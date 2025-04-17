var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { SURVEYS_ACTIVATED } from '../constants';
import { ActionMatcher } from '../extensions/surveys/action-matcher';
import { isUndefined } from './type-utils';
var SurveyEventReceiver = /** @class */ (function () {
    function SurveyEventReceiver(instance) {
        this.instance = instance;
        this.eventToSurveys = new Map();
        this.actionToSurveys = new Map();
    }
    SurveyEventReceiver.prototype.register = function (surveys) {
        var _a;
        if (isUndefined((_a = this.instance) === null || _a === void 0 ? void 0 : _a._addCaptureHook)) {
            return;
        }
        this.setupEventBasedSurveys(surveys);
        this.setupActionBasedSurveys(surveys);
    };
    SurveyEventReceiver.prototype.setupActionBasedSurveys = function (surveys) {
        var _this = this;
        var actionBasedSurveys = surveys.filter(function (survey) { var _a, _b, _c, _d; return ((_a = survey.conditions) === null || _a === void 0 ? void 0 : _a.actions) && ((_d = (_c = (_b = survey.conditions) === null || _b === void 0 ? void 0 : _b.actions) === null || _c === void 0 ? void 0 : _c.values) === null || _d === void 0 ? void 0 : _d.length) > 0; });
        if (actionBasedSurveys.length === 0) {
            return;
        }
        if (this.actionMatcher == null) {
            this.actionMatcher = new ActionMatcher(this.instance);
            this.actionMatcher.init();
            // match any actions to its corresponding survey.
            var matchActionToSurvey = function (actionName) {
                _this.onAction(actionName);
            };
            this.actionMatcher._addActionHook(matchActionToSurvey);
        }
        actionBasedSurveys.forEach(function (survey) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            if (survey.conditions &&
                ((_a = survey.conditions) === null || _a === void 0 ? void 0 : _a.actions) &&
                ((_c = (_b = survey.conditions) === null || _b === void 0 ? void 0 : _b.actions) === null || _c === void 0 ? void 0 : _c.values) &&
                ((_f = (_e = (_d = survey.conditions) === null || _d === void 0 ? void 0 : _d.actions) === null || _e === void 0 ? void 0 : _e.values) === null || _f === void 0 ? void 0 : _f.length) > 0) {
                // register the known set of actions with
                // the action-matcher so it can match
                // events to actions
                (_g = _this.actionMatcher) === null || _g === void 0 ? void 0 : _g.register(survey.conditions.actions.values);
                // maintain a mapping of (Action1) => [Survey1, Survey2, Survey3]
                // where Surveys 1-3 are all activated by Action1
                (_k = (_j = (_h = survey.conditions) === null || _h === void 0 ? void 0 : _h.actions) === null || _j === void 0 ? void 0 : _j.values) === null || _k === void 0 ? void 0 : _k.forEach(function (action) {
                    if (action && action.name) {
                        var knownSurveys = _this.actionToSurveys.get(action.name);
                        if (knownSurveys) {
                            knownSurveys.push(survey.id);
                        }
                        _this.actionToSurveys.set(action.name, knownSurveys || [survey.id]);
                    }
                });
            }
        });
    };
    SurveyEventReceiver.prototype.setupEventBasedSurveys = function (surveys) {
        var _this = this;
        var _a;
        var eventBasedSurveys = surveys.filter(function (survey) { var _a, _b, _c, _d; return ((_a = survey.conditions) === null || _a === void 0 ? void 0 : _a.events) && ((_d = (_c = (_b = survey.conditions) === null || _b === void 0 ? void 0 : _b.events) === null || _c === void 0 ? void 0 : _c.values) === null || _d === void 0 ? void 0 : _d.length) > 0; });
        if (eventBasedSurveys.length === 0) {
            return;
        }
        // match any events to its corresponding survey.
        var matchEventToSurvey = function (eventName, eventPayload) {
            _this.onEvent(eventName, eventPayload);
        };
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a._addCaptureHook(matchEventToSurvey);
        surveys.forEach(function (survey) {
            var _a, _b, _c;
            // maintain a mapping of (Event1) => [Survey1, Survey2, Survey3]
            // where Surveys 1-3 are all activated by Event1
            (_c = (_b = (_a = survey.conditions) === null || _a === void 0 ? void 0 : _a.events) === null || _b === void 0 ? void 0 : _b.values) === null || _c === void 0 ? void 0 : _c.forEach(function (event) {
                if (event && event.name) {
                    var knownSurveys = _this.eventToSurveys.get(event.name);
                    if (knownSurveys) {
                        knownSurveys.push(survey.id);
                    }
                    _this.eventToSurveys.set(event.name, knownSurveys || [survey.id]);
                }
            });
        });
    };
    SurveyEventReceiver.prototype.onEvent = function (event, eventPayload) {
        var _a, _b, _c;
        var existingActivatedSurveys = ((_b = (_a = this.instance) === null || _a === void 0 ? void 0 : _a.persistence) === null || _b === void 0 ? void 0 : _b.props[SURVEYS_ACTIVATED]) || [];
        if (SurveyEventReceiver.SURVEY_SHOWN_EVENT_NAME == event &&
            eventPayload &&
            existingActivatedSurveys.length > 0) {
            // remove survey that from activatedSurveys here.
            var surveyId = (_c = eventPayload === null || eventPayload === void 0 ? void 0 : eventPayload.properties) === null || _c === void 0 ? void 0 : _c.$survey_id;
            if (surveyId) {
                var index = existingActivatedSurveys.indexOf(surveyId);
                if (index >= 0) {
                    existingActivatedSurveys.splice(index, 1);
                    this._updateActivatedSurveys(existingActivatedSurveys);
                }
            }
        }
        else {
            if (this.eventToSurveys.has(event)) {
                this._updateActivatedSurveys(existingActivatedSurveys.concat(this.eventToSurveys.get(event) || []));
            }
        }
    };
    SurveyEventReceiver.prototype.onAction = function (actionName) {
        var _a, _b;
        var existingActivatedSurveys = ((_b = (_a = this.instance) === null || _a === void 0 ? void 0 : _a.persistence) === null || _b === void 0 ? void 0 : _b.props[SURVEYS_ACTIVATED]) || [];
        if (this.actionToSurveys.has(actionName)) {
            this._updateActivatedSurveys(existingActivatedSurveys.concat(this.actionToSurveys.get(actionName) || []));
        }
    };
    SurveyEventReceiver.prototype._updateActivatedSurveys = function (activatedSurveys) {
        var _a;
        var _b, _c;
        // we use a new Set here to remove duplicates.
        (_c = (_b = this.instance) === null || _b === void 0 ? void 0 : _b.persistence) === null || _c === void 0 ? void 0 : _c.register((_a = {},
            _a[SURVEYS_ACTIVATED] = __spreadArray([], __read(new Set(activatedSurveys)), false),
            _a));
    };
    SurveyEventReceiver.prototype.getSurveys = function () {
        var _a, _b;
        var existingActivatedSurveys = (_b = (_a = this.instance) === null || _a === void 0 ? void 0 : _a.persistence) === null || _b === void 0 ? void 0 : _b.props[SURVEYS_ACTIVATED];
        return existingActivatedSurveys ? existingActivatedSurveys : [];
    };
    SurveyEventReceiver.prototype.getEventToSurveys = function () {
        return this.eventToSurveys;
    };
    SurveyEventReceiver.prototype._getActionMatcher = function () {
        return this.actionMatcher;
    };
    SurveyEventReceiver.SURVEY_SHOWN_EVENT_NAME = 'survey shown';
    return SurveyEventReceiver;
}());
export { SurveyEventReceiver };
//# sourceMappingURL=survey-event-receiver.js.map