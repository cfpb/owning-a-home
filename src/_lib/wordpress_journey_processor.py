import sys
import json
import os.path
import requests
import dateutil.parser


def posts_at_url(url):
    
    current_page = 1
    max_page = sys.maxint

    while current_page <= max_page:
        url = os.path.expandvars(url)
        resp = requests.get(url, params={'page':current_page, 'count': '-1'})
        results = json.loads(resp.content) 
        current_page += 1
        max_page = results['pages']
        for p in results['posts']:
            yield p


def documents(name, url, **kwargs):

    for post in posts_at_url(url):
        yield process_journey(post)


def process_journey(item):

    del item['comments']
    del item['date']
    custom_fields = item['custom_fields']
    item['_id'] = item['slug']
    
    if item['parent'] != 0:
        # This is a step item
        item['has_parent'] = True
        if custom_fields.get('what_to_know'):
            item['what_to_know'] = custom_fields['what_to_know'][0]
        if custom_fields.get('how_to_take_action'):
            item['how_to_take_action'] = \
                custom_fields['how_to_take_action'][0]
        if custom_fields.get('key_tool'):
            key_tool = {}
            key_tool['url'] = custom_fields['key_tool'][0]
            key_tool['text'] = custom_fields['key_tool'][1]
            item['key_tool'] = key_tool
    else:
        # This is a phase item
        item['has_parent'] = False
        
        # create list of tools
        item['tools'] = []
        for x in xrange(0,2):
            tool = {}        
            fields = ['description', 'link']
            for field in fields:
                field_name = 'tools_%s_%s' % (str(x), field)
                if field_name in custom_fields:
                    if field == 'link':
                        tool['url'] = custom_fields[field_name][0]
                        tool['text'] = custom_fields[field_name][0]
                    else:
                        tool[field] = custom_fields[field_name][0]

            if tool:
                item['tools'].append(tool)
                
        # create list of milestones
        milestones = []
        for x in xrange(0,3):
            key = 'milestones_%s_milestone' % x
            if key in custom_fields:
                milestones.append(custom_fields[key][0])

        if milestones:     
            item['milestones'] = milestones
       
    return item
