/**
 * Data-to-Cosmos Mapping System Types
 *
 * This module defines the types and interfaces for the Data-to-Cosmos Mapping System,
 * which maps database entities to cosmic objects in the visualization.
 *
 * @version 1.0.0
 */
/**
 * Entity type
 */
export var EntityType;
(function (EntityType) {
    /** Repository entity */
    EntityType["REPOSITORY"] = "repository";
    /** Issue entity */
    EntityType["ISSUE"] = "issue";
    /** Pull request entity */
    EntityType["PULL_REQUEST"] = "pull_request";
    /** User entity */
    EntityType["USER"] = "user";
    /** Organization entity */
    EntityType["ORGANIZATION"] = "organization";
    /** Project entity */
    EntityType["PROJECT"] = "project";
    /** Milestone entity */
    EntityType["MILESTONE"] = "milestone";
    /** Label entity */
    EntityType["LABEL"] = "label";
    /** Comment entity */
    EntityType["COMMENT"] = "comment";
    /** Commit entity */
    EntityType["COMMIT"] = "commit";
    /** Branch entity */
    EntityType["BRANCH"] = "branch";
    /** Tag entity */
    EntityType["TAG"] = "tag";
    /** Workflow entity */
    EntityType["WORKFLOW"] = "workflow";
    /** Action entity */
    EntityType["ACTION"] = "action";
    /** Database entity */
    EntityType["DATABASE"] = "database";
    /** Table entity */
    EntityType["TABLE"] = "table";
    /** Record entity */
    EntityType["RECORD"] = "record";
    /** Collection entity */
    EntityType["COLLECTION"] = "collection";
    /** Document entity */
    EntityType["DOCUMENT"] = "document";
    /** Field entity */
    EntityType["FIELD"] = "field";
    /** Custom entity */
    EntityType["CUSTOM"] = "custom";
})(EntityType || (EntityType = {}));
